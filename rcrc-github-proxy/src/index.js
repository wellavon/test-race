// ============================================================
// Cloudflare Worker: Telegram-бот RC:RC + GitHub-прокси
// Команда /add <id> <image> <link> коммитит миссию в missions.json
// ============================================================

const GITHUB_API = 'https://api.github.com';

export default {
  async fetch(request, env) {
    // CORS для возможных запросов с фронта (не помешает)
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // GET — для отладки, что Worker жив
    if (request.method === 'GET') {
      return new Response('RC:RC Telegram Bot is running', {
        status: 200,
        headers: corsHeaders
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response('Bad JSON', { status: 400, headers: corsHeaders });
    }

    // ============================================================
    // ВАРИАНТ 1: Запрос от Telegram (webhook) — есть поле update_id
    // ============================================================
    if (body.update_id !== undefined || body.message) {
      return await handleTelegram(body, env, corsHeaders);
    }

    // ============================================================
    // ВАРИАНТ 2: Запрос от сайта (старый формат) — есть поле mission
    // Оставляем на случай, если фронт ещё стучится
    // ============================================================
    if (body.mission) {
      try {
        const result = await addMissionToGitHub(env, body.mission);
        if (result.ok) {
          return new Response(
            JSON.stringify({ ok: true, message: `Миссия ${body.mission.id} добавлена`, commit: result.commit }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          return new Response(
            JSON.stringify({ ok: false, error: result.error, details: result.details }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (e) {
        return new Response(
          JSON.stringify({ ok: false, error: e.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response('Unknown payload', { status: 400, headers: corsHeaders });
  }
};

// ============================================================
// Обработка Telegram-обновлений
// ============================================================
async function handleTelegram(update, env, corsHeaders) {
  const message = update.message;
  if (!message || !message.text) {
    return new Response('OK', { status: 200, headers: corsHeaders });
  }

  const chatId = message.chat.id;
  const userId = message.from.id;
  const text = message.text.trim();

  // Проверка доступа: только твой Telegram ID
  const allowedIds = (env.ALLOWED_USER_IDS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (allowedIds.length && !allowedIds.includes(String(userId))) {
    await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, '⛔ У тебя нет доступа.');
    return new Response('OK', { status: 200, headers: corsHeaders });
  }

  // /start
  if (text === '/start') {
    await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId,
      '🏁 <b>RC:RC Bot</b>\n\n' +
      'Команды:\n' +
      '• <code>/add &lt;id&gt; &lt;image&gt; &lt;link&gt;</code> — добавить миссию\n' +
      '• <code>/help</code> — справка\n\n' +
      'Пример:\n' +
      '<code>/add 33 lobby https://youtu.be/xxxx</code>',
      'HTML'
    );
    return new Response('OK', { status: 200, headers: corsHeaders });
  }

  // /help
  if (text === '/help') {
    await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId,
      '📖 <b>Как добавить миссию</b>\n\n' +
      '<code>/add &lt;id&gt; &lt;image&gt; &lt;link&gt;</code>\n\n' +
      '• <b>id</b> — номер миссии (число)\n' +
      '• <b>image</b> — кодовое имя картинки (латиница, цифры, _)\n' +
      '• <b>link</b> — ссылка на YouTube\n\n' +
      'Пример:\n' +
      '<code>/add 33 lobby https://youtu.be/x7qO3zcMh2Y</code>',
      'HTML'
    );
    return new Response('OK', { status: 200, headers: corsHeaders });
  }

  // /add
  if (text.startsWith('/add')) {
    const parts = text.split(/\s+/).slice(1);

    if (parts.length !== 3) {
      await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId,
        '❌ Неверный формат. Используй:\n\n' +
        '<code>/add 33 lobby https://youtu.be/xxxx</code>',
        'HTML'
      );
      return new Response('OK', { status: 200, headers: corsHeaders });
    }

    const [idStr, image, link] = parts;
    const missionId = parseInt(idStr, 10);

    if (!missionId || missionId < 1) {
      await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, '❌ ID должен быть положительным числом.');
      return new Response('OK', { status: 200, headers: corsHeaders });
    }

    if (!/^[a-z0-9_]+$/.test(image)) {
      await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId,
        '❌ Имя картинки — только латиница в нижнем регистре, цифры и подчёркивания.\n\n' +
        'Примеры: <code>lobby</code>, <code>bad_ateez</code>, <code>1_only</code>',
        'HTML'
      );
      return new Response('OK', { status: 200, headers: corsHeaders });
    }

    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, '❌ Ссылка должна начинаться с http:// или https://');
      return new Response('OK', { status: 200, headers: corsHeaders });
    }

    await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, `⏳ Добавляю миссию ${missionId}...`);

    try {
      const result = await addMissionToGitHub(env, {
        id: missionId,
        image: image,
        link: link
      });

      if (result.ok) {
        await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId,
          `✅ <b>Миссия ${missionId} добавлена!</b>\n\n` +
          `🎬 image: <code>${escapeHtml(image)}</code>\n` +
          `🔗 ${escapeHtml(link)}\n\n` +
          `📦 <a href="${result.commit}">Коммит на GitHub</a>\n\n` +
          `<i>Через ~1 минуту появится в каталоге.</i>`,
          'HTML'
        );
      } else {
        await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId,
          `❌ Ошибка: ${escapeHtml(result.error)}\n\n` +
          `${result.details ? escapeHtml(String(result.details).slice(0, 300)) : ''}`,
          'HTML'
        );
      }
    } catch (e) {
      await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, `❌ Ошибка: ${escapeHtml(e.message)}`);
    }

    return new Response('OK', { status: 200, headers: corsHeaders });
  }

  await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, 'Не понимаю команду. Напиши /help.');
  return new Response('OK', { status: 200, headers: corsHeaders });
}

// ============================================================
// Отправка сообщения в Telegram
// ============================================================
async function sendMessage(token, chatId, text, parseMode = null) {
  const body = {
    chat_id: chatId,
    text: text,
    disable_web_page_preview: true
  };
  if (parseMode) body.parse_mode = parseMode;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

// ============================================================
// Коммит миссии в GitHub
// ============================================================
async function addMissionToGitHub(env, mission) {
  if (!mission || !mission.id || !mission.link || !mission.image) {
    return { ok: false, error: 'Missing mission fields' };
  }

  const url = `${GITHUB_API}/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/missions.json`;

  const getResp = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'rcrc-bot'
    }
  });

  if (!getResp.ok) {
    const err = await getResp.text();
    return { ok: false, error: 'GitHub read failed', details: err };
  }

  const fileData = await getResp.json();
  const currentSha = fileData.sha;

  // Декодируем base64 (Unicode-safe)
  let decoded;
  try {
    decoded = decodeURIComponent(escape(atob(fileData.content.replace(/\n/g, ''))));
  } catch (e) {
    decoded = atob(fileData.content.replace(/\n/g, ''));
  }

  let missionsData;
  try {
    missionsData = JSON.parse(decoded);
  } catch (e) {
    return { ok: false, error: 'missions.json повреждён (невалидный JSON)' };
  }

  if (!Array.isArray(missionsData.missions)) {
    missionsData.missions = [];
  }

  // Проверка дубликата
  const exists = missionsData.missions.some(m => Number(m.id) === Number(mission.id));
  if (exists) {
    return { ok: false, error: `Миссия ${mission.id} уже существует` };
  }

  missionsData.missions.push({
    id: Number(mission.id),
    name: `Миссия ${mission.id}`,
    link: String(mission.link),
    image: String(mission.image)
  });

  // Кодируем обратно в base64 (Unicode-safe)
  const jsonStr = JSON.stringify(missionsData, null, 2);
  const newContent = btoa(unescape(encodeURIComponent(jsonStr)));

  const putResp = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'rcrc-bot'
    },
    body: JSON.stringify({
      message: `Add mission ${mission.id} via Telegram bot`,
      content: newContent,
      sha: currentSha,
      committer: {
        name: env.GIT_COMMITTER_NAME || 'RC:RC Bot',
        email: env.GIT_COMMITTER_EMAIL || 'bot@rcrc.local'
      }
    })
  });

  if (!putResp.ok) {
    const err = await putResp.text();
    return { ok: false, error: 'GitHub commit failed', details: err };
  }

  const result = await putResp.json();
  return {
    ok: true,
    commit: result.commit?.html_url || ''
  };
}

// ============================================================
// Экранирование HTML
// ============================================================
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
