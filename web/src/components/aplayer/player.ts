import axios from 'axios';
export interface MetingMusic {
  author: string;
  lrc: string;
  pic: string;
  title: string;
  url: string;
}
export class Player {
  static getSongSheet(server: string, type: String, id: String) {
    return axios.get<MetingMusic[]>(
      `${
        import.meta.env.DEV ? '/meting/api' : 'https://api.i-meto.com/meting/api'
      }?server=${server}&type=${type}&id=${id}&r=${Math.random()}`
    );
  }
}
