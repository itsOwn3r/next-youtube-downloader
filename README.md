# Next.js YouTube Downloader


## Description

Super simple and super fast YouTube Downloader, created with NextJS!

  
## Features

- Download Audio.

- Download videos in various formats and resolutions.

- Download "Shorts".

- Shows progress of downloaded file with "Server-Sent Events".

- 360p, 480p, 720p and 1080p supported.

- Dark/Light mode.

- Provides two buttons after the download is finished, whether to open the file or the folder.

  
![Youtube-Downloader](https://github.com/user-attachments/assets/0e626d46-8677-45e7-a076-e6d2ac8f98fb)

  

TODO:

- ✅ Database connection and saving a history of downloaded videos/audios

- ✅ Support for adding playlist

- ✅ Setting a default resolution for downloading videos

  

  

## Installation


First of all, make sure that NodeJS and ffmpeg are installed on your system.

1. Clone the repository:


```bash

git  clone  https://github.com/yourusername/nextjs-youtube-downloader.git


```

  

2. Navigate to the project directory:

  

```bash

cd  nextjs-youtube-downloader

```

  

3. Install dependencies:

  
```bash

npm  install

  
```

  

  
## Usage

1. Start the app:

  

```bash

npm  start

  
```

  

2. Open your browser and go to `http://localhost:3000`.
3. Paste a URL of any video on YouTube, and the app will automatically fetches video's info and provides download buttons.
4. Select a resolution.
5. Wait for files to be downloaded.
6. You will see two buttons, which can open the file or the download folder.
7. You can also see the downloaded files in `public` folder. Videos and Audios are gonna be going to their sub-folder of `videos` and `audios`.

  

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

  

## Caution


This project is intended for educational purposes only. Downloading copyrighted content without permission is illegal and against YouTube's terms of service. Use this tool responsibly.

  

## License

This project is licensed under the MIT License.