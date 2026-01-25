import SpotifyWebApi from "spotify-web-api-node";

const client = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "https://smrth.dev",
});

const TOKEN_URL = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }
  const authorization = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN as string,
  });
  const { access_token: accessToken }: TokenResponse = (await fetch(
    `${TOKEN_URL}?${params.toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      cache: "no-store",
    }
  ).then((r) => r.json())) as TokenResponse;

  return accessToken;
};

export async function getSpotifyData() {
  const getCurrentPlayback = async () => {
    let track: SpotifyApi.TrackObjectFull;

    // Prefer the currently playing track if available, fallback to a recently played track
    const currentlyPlayingTrack = (await client.getMyCurrentPlayingTrack()).body
      .item;
    if (currentlyPlayingTrack && "artists" in currentlyPlayingTrack) {
      track = currentlyPlayingTrack;
    } else {
      const { track: recentTrack } = (await client.getMyRecentlyPlayedTracks())
        .body.items[0];
      track = recentTrack;
    }

    return {
      trackName: track.name,
      artist: track.artists[0].name,
      albumArt: track.album.images[0].url,
    };
  };

  const getTopArtists = async () => {
    return (await client.getMyTopArtists()).body.items.map((artist) => ({
      name: artist.name,
      art: artist.images,
      genres: artist.genres,
    }));
  };

  if (process.env.SPOTIFY_REFRESH_TOKEN) {
    client.setAccessToken(await getAccessToken());

    const [currentPlayback, topArtists] = await Promise.all([
      getCurrentPlayback(),
      getTopArtists(),
    ]);

    return {
      currentPlayback,
      topArtists,
    };
  } else {
    throw new Error("No Spotify refresh token found");
  }
}
