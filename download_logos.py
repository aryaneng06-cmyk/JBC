import urllib.request
import ssl

urls = {
    "nbt.png": "https://ads.timesofindia.com/assets/images/NBT.png",
    "lakme.png": "https://lakmeacademybangalore.in/lakme-academy-logo.png",
    "vivo.png": "https://images.seeklogo.com/logo-png/52/2/vivo-communication-technology-logo-png_seeklogo-527673.png",
    "aequitas.jpg": "https://equalifi.org/wp-content/uploads/2021/12/Aequitas-Logo.jpg"
}

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for name, url in urls.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx) as response, open(f'assets/{name}', 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Downloaded {name} successfully")
    except Exception as e:
        print(f"Error downloading {name}: {e}")
