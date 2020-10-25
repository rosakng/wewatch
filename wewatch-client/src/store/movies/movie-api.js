import { axiosInstance } from 'lib/api-utils';

const movieApi = {
  // This is stubbed -- need to flesh out what we want the api call to look like
  getMovieData() {
    const headers = {
      'Content-Type': 'application/json',
    };

    return axiosInstance.get(
      `/v1/movie`,
      { headers },
    )
      .then((response) => response.data);
  }
}

export default movieApi;
