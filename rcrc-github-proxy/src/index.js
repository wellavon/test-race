export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();
      const { mission } = body;

      if (!mission || !mission.id || !mission.link || !mission.image) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Missing mission fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const getUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/missions.json`;

      const getResp = await fetch(getUrl, {
        headers: {
          'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'rcrc-bot'
        }
      });

      if (!getResp.ok) {
        const err = await getResp.text();
        return new Response(
          JSON.stringify({ ok: false, error: 'GitHub read failed', details: err }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const fileData = await getResp.json();
      const currentSha = fileData.sha;

      const decoded = atob(fileData.content.replace(/\n/g, ''));
      const missionsData = JSON.parse(decoded);

      if (!Array.isArray(missionsData.missions)) {
        missionsData.missions = [];
      }

      const exists = missionsData.missions.some(m => Number(m.id) === Number(mission.id));
      if (exists) {
        return new Response(
          JSON.stringify({ ok: false, error: `Mission ${mission.id} already exists` }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      missionsData.missions.push({
        id: Number(mission.id),
        name: `Миссия ${mission.id}`,
        link: String(mission.link),
        image: String(mission.image)
      });

      const newContent = btoa(unescape(encodeURIComponent(JSON.stringify(missionsData, null, 2))));

      const putResp = await fetch(getUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'rcrc-bot'
        },
        body: JSON.stringify({
          message: `Add mission ${mission.id} via bot`,
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
        return new Response(
          JSON.stringify({ ok: false, error: 'GitHub commit failed', details: err }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await putResp.json();
      return new Response(
        JSON.stringify({
          ok: true,
          message: `Миссия ${mission.id} добавлена`,
          commit: result.commit?.html_url
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (e) {
      return new Response(
        JSON.stringify({ ok: false, error: e.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }
};
