async function getPhotographers(url) {
  try {
    const api = await fetch(url);
    if (api.ok) {
      const res = await api.json();
      const photographers = res.photographers;
      return photographers;
    }
  } catch (err) {
    console.error(err.message, err.cause);
  }
}

async function getMedia(url) {
  try {
    const api = await fetch(url);
    if (api.ok) {
      const res = await api.json();
      const media = res.media;
      return media;
    }
  } catch (err) {
    console.error(err.message, err.cause);
  }
}
