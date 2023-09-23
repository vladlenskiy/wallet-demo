import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  constructor(private storage: typeof AsyncStorage) {}

  public async setData<T>(key: string, value: T): Promise<T> {
    const jsonValue = JSON.stringify(value);
    await this.storage.setItem(key, jsonValue);
    return value;
  }

  public async getData<T>(key: string): Promise<T> {
    return await this.storage
      .getItem(key)
      .then(value => (value != null ? JSON.parse(value) : null));
  }
}

const storageService = new StorageService(AsyncStorage);
export default storageService;
