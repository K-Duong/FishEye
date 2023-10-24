const getPhotographers = async (url)=> {
  try {
    const api = await fetch(url);
    // console.log(api);
    if (api.ok) {
      const res = await api.json();
      const photographers = res.photographers;
      return photographers;
    } else {
      throw new Error("data photographers not found")
    }
  } catch (err) {
    console.error(err.message);
  }
}

const getMedia = async (url) => {
  try {
    const api = await fetch(url);
    // console.log(api);
    if (api.ok) {
      const res = await api.json();
      const media = res.media;
      return media;
    }else {
      throw new Error("data media not found")
    }
  } catch (err) {
    console.error(err.message);
  }
}
