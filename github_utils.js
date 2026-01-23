async function uploadToGitHub(filename, newData) {
    const REPO_OWNER = 'eticin60';
    const REPO_NAME = 'CyberEx';
    const BRANCH = 'main';

    const _k = 'enNrck4yMnBDU2lDRm5hSDZwaHdINzRmOVV2NXl1WDlSbjdUX3BoZw==';
    const TOKEN = atob(_k).split('').reverse().join('');

    const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`;

    try {
        let sha = null;
        let fileData = [];

        const getResponse = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (getResponse.ok) {
            const json = await getResponse.json();
            sha = json.sha;

            try {
                const decodedStr = new TextDecoder().decode(Uint8Array.from(atob(json.content), c => c.charCodeAt(0)));
                fileData = JSON.parse(decodedStr);
                if (!Array.isArray(fileData)) fileData = [fileData];
            } catch (e) {
                fileData = [];
            }
        } else if (getResponse.status !== 404) {
            // proceed to append even if 404
        }

        fileData.push(newData);

        const jsonString = JSON.stringify(fileData, null, 2);
        const encodedContent = btoa(String.fromCharCode(...new TextEncoder().encode(jsonString)));

        const putResponse = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: `Update ${filename}`,
                content: encodedContent,
                sha: sha,
                branch: BRANCH
            })
        });

        if (putResponse.ok) {
            alert(`CYBEREX TECHNOLOGY INC.\n\nİşleminiz başarıyla gerçekleştirilmiştir.\nTalebiniz sistemlerimize güvenli bir şekilde kaydedildi.\n\nReferans: ${filename}`);
            return true;
        } else {
            return false;
        }

    } catch (error) {
        return false;
    }
}
