# Sora-Modules

This repository contains the following modules: **_JellyFin_** and **_Emby_**, which allows you to enjoy emby and jellyfin on [Sora](https://github.com/cranci1/Sora).

## Setup Instructions
> As of [Sora-2](https://github.com/cranci1/Sora-2) the configuration can be made in the app, and so Hosting the files is not necessary, everything will be saved locally.

1. **Configure Your Server Info**  
   Open the JS file and replace the placeholders with:
   - Your Emby/JellyFin server's base URL (e.g., `http://localhost:8096`)
   
   - Your Emby/JellyFin user ID. You can find it in Dashboard -> Users -> Select the user -> take the "userID" value from the URL (e.g., "http://localhost:8096/web/#/dashboard/users/profile?userId=529c1be6ba1048ccbdbde06b94bff4e2", userID will be: "529c1be6ba1048ccbdbde06b94bff4e2")
   
   - Your Emby/JellyFin API Key. You can create an API Key in Dashboard -> Api Keys -> generate a new one and copy the token.

2. **Host the Files Privately**  
   Upload both the `.js` and `.json` files to a **private** server.  
   ⚠️ Do **not** host these files publicly — exposing your JellyFin/Emby host can compromise your server.

3. **Update the JSON File**  
   In the JSON file, set the `scriptUrl` key to the **raw URL** of your hosted JS file.

4. **Import to Sora**  
   Copy the **raw URL** of your JSON file and import it into Sora.

## License

Any contribution is very welcome, and this license applies to the code even before it was added.

```
MIT License

Copyright (c) 2025 cranci1

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
