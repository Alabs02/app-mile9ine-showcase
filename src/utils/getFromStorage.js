import localForage from '../services/localforage';


const getFromStorage = async (key) => {
  try {
    if (key !== (null || undefined)) {
      const payload = await localForage.getItem(key);
      return payload;
    }
  } catch (err) {
    console.error(err);
  }
}

export default getFromStorage;