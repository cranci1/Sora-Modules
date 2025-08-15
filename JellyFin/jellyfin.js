//
// Sora JellyFin Module
// cranci
//
// This module allows you to search for media on your JellyFin server, extract details about it,
// and retrieve stream URLs for playback. It supports searching for movies, TV shows, and episodes
// and can handle both single episodes and entire seasons.
//
// Provide the IP and port of your JellyFin server in the baseUrl variable.
// Provide your JellyFin API key in the apiKey variable. To get your API key:
// 1. Log into your JellyFin web interface as an admin
// 2. Go to Dashboard > API Keys
// 3. Create a new API key
//
// Make sure to host this file on a private webserver or a private GitHub repository!
//

// Settings start
const baseUrl = "http://localhost:8096"; // e.g., "http://192.168.0.1:8096";
const apiKey = "key"; // Your JellyFin API key
const userId = "userID"; // Your JellyFin User ID (can be found in Dashboard > Users, inside the page URL)
// Settings end

//
// Do not edit below this line unless you know what you're doing.
//

async function searchResults(keyword) {
    try {
        const headers = {
            "accept": "application/json",
            "X-Emby-Authorization": `MediaBrowser Token="${apiKey}"`
        };
        
        const searchUrl = `${baseUrl}/Items?searchTerm=${encodeURIComponent(keyword)}&includeItemTypes=Movie,Series&recursive=true&userId=${userId}`;
        const response = await fetchv2(searchUrl, headers);
        const json = await response.json();
        const results = [];

        const items = json?.Items || [];

        for (const item of items) {
            const imageUrl = item.Id ? `${baseUrl}/Items/${item.Id}/Images/Primary?api_key=${apiKey}` : "";
            
            results.push({
                title: item.Name?.trim() || "Unknown",
                image: imageUrl,
                href: `/Items/${item.Id}`
            });
        }

        return JSON.stringify(results);
    } catch (err) {
        return JSON.stringify([{
            title: "Error",
            image: "Error",
            href: "Error"
        }]);
    }
}

async function extractDetails(key) {
    try {
        const headers = {
            "accept": "application/json",
            "X-Emby-Authorization": `MediaBrowser Token="${apiKey}"`
        };
        
        const itemId = key.split('/').pop();
        
        const response = await fetchv2(`${baseUrl}/Items/${itemId}?userId=${userId}`, headers);
        const json = await response.json();

        const description = json?.Overview?.trim() || "N/A";
        const airdate = json?.PremiereDate ? json.PremiereDate.split('T')[0] : "N/A";
        
        let metadata = json;
        if (json?.Type === "Series") {
            const seasonsResponse = await fetchv2(`${baseUrl}/Shows/${itemId}/Seasons?userId=${userId}`, headers);
            const seasonsJson = await seasonsResponse.json();
            
            if (seasonsJson?.Items?.length > 0) {
                const firstSeasonId = seasonsJson.Items[0].Id;
                const episodesResponse = await fetchv2(`${baseUrl}/Shows/${itemId}/Episodes?seasonId=${firstSeasonId}&userId=${userId}`, headers);
                const episodesJson = await episodesResponse.json();
                
                if (episodesJson?.Items?.length > 0) {
                    metadata = episodesJson.Items[0];
                }
            }
        }

        return JSON.stringify([{
            description: metadata?.Overview?.trim() || description,
            aliases: "N/A",
            airdate: metadata?.PremiereDate ? metadata.PremiereDate.split('T')[0] : airdate
        }]);
    } catch (err) {
        return JSON.stringify([{
            description: "Error",
            aliases: "Error",
            airdate: "Error"
        }]);
    }
}

async function extractEpisodes(key) {
    const results = [];
    try {
        const headers = {
            "accept": "application/json",
            "X-Emby-Authorization": `MediaBrowser Token="${apiKey}"`
        };
        
        const itemId = key.split('/').pop();
        
        const itemResponse = await fetchv2(`${baseUrl}/Items/${itemId}?userId=${userId}`, headers);
        const itemJson = await itemResponse.json();

        if (itemJson?.Type === "Series") {
            const episodesResponse = await fetchv2(`${baseUrl}/Shows/${itemId}/Episodes?userId=${userId}`, headers);
            const episodesJson = await episodesResponse.json();
            const episodes = episodesJson?.Items || [];

            let epNumber = 1;
            for (const ep of episodes) {
                results.push({
                    href: `/Items/${ep.Id}`,
                    number: epNumber++
                });
            }
        } else if (itemJson?.Type === "Season") {
            const episodesResponse = await fetchv2(`${baseUrl}/Shows/${itemJson.SeriesId}/Episodes?seasonId=${itemId}&userId=${userId}`, headers);
            const episodesJson = await episodesResponse.json();
            const episodes = episodesJson?.Items || [];

            let epNumber = 1;
            for (const ep of episodes) {
                results.push({
                    href: `/Items/${ep.Id}`,
                    number: epNumber++
                });
            }
        } else {
            results.push({
                href: key,
                number: 1
            });
        }

        return JSON.stringify(results);
    } catch (err) {
        return JSON.stringify([{
            href: "Error",
            number: "Error"
        }]);
    }
}

async function extractStreamUrl(key) {
    try {
        const headers = {
            "accept": "application/json",
            "X-Emby-Authorization": `MediaBrowser Token="${apiKey}"`
        };
        
        const itemId = key.split('/').pop();
        
        const playbackResponse = await fetchv2(`${baseUrl}/Items/${itemId}/PlaybackInfo?userId=${userId}`, {
            ...headers,
            method: 'POST',
            body: JSON.stringify({
                DeviceProfile: {
                    MaxStreamingBitrate: 120000000,
                    MaxStaticBitrate: 100000000,
                    MusicStreamingTranscodingBitrate: 384000,
                    DirectPlayProfiles: [
                        {
                            Container: "mp4,m4v,mkv,mov,avi,wmv,ts,webm",
                            Type: "Video"
                        }
                    ]
                }
            }),
            'Content-Type': 'application/json'
        });
        
        const playbackJson = await playbackResponse.json();
        const mediaSources = playbackJson?.MediaSources || [];
        
        if (mediaSources.length > 0) {
            const mediaSource = mediaSources[0];
            
            if (mediaSource.SupportsDirectPlay) {
                const streamUrl = `${baseUrl}/Items/${itemId}/Download?api_key=${apiKey}`;
                console.log(streamUrl);
                return streamUrl;
            }
            
            const transcodingUrl = `${baseUrl}/Videos/${itemId}/stream?api_key=${apiKey}&userId=${userId}`;
            console.log(transcodingUrl);
            return transcodingUrl;
        }
        
        throw new Error("No media sources found");
    } catch (err) {
        console.error("Stream extraction error:", err);
    }
}
