import os
import requests
from urllib.parse import urlparse

# Ensure directory exists
output_dir = "public/images"
os.makedirs(output_dir, exist_ok=True)

images = {
    "hero-1.jpg": "https://lh3.googleusercontent.com/pw/AP1GczNsoul585yfLdNLiET016DDBQj5wXZYYH2wXybYFYmlkz2Jdt9U5eTxKr0bC_xxqmVQWUr0mdYxVwu78mYSN-j9mXe0oT_nphhewV-ygGLfhPz9RfNbO6jPxApwMcpVPJrQ4Wfs3vhYtAtA6Ovbr9ds=w1386-h924-s-no-gm?authuser=0",
    "hero-2.jpg": "https://lh3.googleusercontent.com/pw/AP1GczPv0vouTdxMrvNGzpzLyaowLgT_fZ1Mqca6szYXmrfqDJTTrIrx6OKXukM2o1MaI-QEGsknTY3zrphaNRoZe-UKolwwWTPyvF0tmqiBm9NxY9ees5xS1PjF4UeIqJeAgGoLhHo4Ftdq9OmPkApW33uT=w1386-h924-s-no-gm?authuser=0",
    "hero-3.jpg": "https://lh3.googleusercontent.com/pw/AP1GczPZvMKsyIQy3xyUazciNEKqk2amLL8P8G4rXMQBP5ZQsAOku0pzSBSXMTuTjQmHkqfVajPodK2kF7nkCtXUxxYq9gYdabTOEgHCLLoQHkfxpqvLa70PJE0JlADY42JX8rPznVxQzN_pV7R9gqbTum9i=w1386-h924-s-no-gm?authuser=0",
    "hero-4.jpg": "https://lh3.googleusercontent.com/pw/AP1GczMO3KlFmNBIRGhBiTZQLKqTB5e92T_1-W1dFH9V__pvf2Kv6D793qFaDjMZ-XhCRzjHqFc633tKwT2LKfPfgCVgKmY3lNsdNxQDJcpzDIMeH5Z3BR9afrO1NXc59Hf8403ejBBQ9ydmQAvSIhOS_nXQ=w1386-h924-s-no-gm?authuser=1",
    "hero-5.jpg": "https://lh3.googleusercontent.com/pw/AP1GczPX1KuRWwRdgGrElv3xr337AjE4xc61C_SuXewjazBqk2tpjj4kQA_uG6jgrMCHqp1E081s5lWxyWWTBqicjMW_VBP9QJ5avZ0iIFVGvWawRR7PxRfdb3X9XR_a0z6_m1yivKoyHPkUbbAckai9hFbI=w1386-h924-s-no-gm?authuser=0",
    "hero-6.jpg": "https://lh3.googleusercontent.com/pw/AP1GczOqckKV5E-1gr3ELDvZC0rV6ki0qcRuMpDdCLKxLvDE5wVs1jSI3YE4JIaaQrZOcBvVsKFOUoWBGDICdrTRUcxxVpwnUMVGJ89sFHGyEeA6n6LK94WPf8hS5qLuPxBpMlzLdxeVQ6fFT1I9XlIUrn7N=w1386-h924-s-no-gm?authuser=0",
    "hero-7.jpg": "https://lh3.googleusercontent.com/pw/AP1GczNYyxLNcLqV7GQGEJZvGxbaIr7hxlem4CDkxmqAfa-eC7IEgHNsVqHxGLoFabpli7CUPYy_0nmpk273kOSWCm5MJ15HhRHy8e8n6yEWKIifxoy7UldCDBadau7smHS1ELF7iO4e6dPZ-eTyvvXrdwCe=w1386-h924-s-no-gm?authuser=0",
    "hero-8.jpg": "https://lh3.googleusercontent.com/pw/AP1GczM5qxTGl5wsfz2TuTq-aLD6cbYWlbTuA4zIemunwSF94IK1Ebu9bt1Hpj4iFz4drHD2aKRGnccaIawZKCQ0twZBAXivEaFAi1xOYvm6FvTuZoThpl6uykaQDXRoElqEllsuTbFokfEpGEF95e2eyrcB=w1386-h924-s-no-gm?authuser=0",
    "hero-9.jpg": "https://lh3.googleusercontent.com/pw/AP1GczPepFaEBbclfqaToKwOcGEgc07ceHNaTrJVlGM3O0GQB6yHP-YkBkN_VSH6HR_aoyxjgVHQ8D2K_oX6g2EQ8lcnfHjH1xK2HL8DDqHGaTwaJt61ffkgUW0IGcYVwtmUKjtN_a8eTgRnHdp1q5nGXbZx=w1386-h924-s-no-gm?authuser=0",
    "testimonial-1.jpeg": "https://www.omkaricse.in/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-25-at-3.37.37-PM.jpeg",
    "infrastructure-1.jpeg": "https://www.omkarcbse.in/wp-content/uploads/2024/01/t2.jpeg",
    "award-1.jpg": "https://www.omkaricse.in/wp-content/uploads/elementor/thumbs/378382505_177325452077317_3106850885357818811_n-qdmudtolnn8krb4nioa9a4yf6d4p5qqpiuna468zgo.jpg",
    "admission-1.png": "https://www.omkaricse.in/wp-content/uploads/2023/10/Admission@4x-1.png",
    "bg-subtle.png": "https://www.transparenttextures.com/patterns/az-subtle.png",
    "omkar-logo.png": "https://www.omkaricse.in/wp-content/uploads/2023/06/OMKAR-LOGO-WHITE-300x208.png",
    "omkar-all-board-logo.png": "https://www.omkarstate.in/wp-content/uploads/2023/03/OMKAR-ALL-BOARD-LOGO-1024x711.png"
}

for filename, url in images.items():
    print(f"Downloading {filename}...")
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(os.path.join(output_dir, filename), 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Downloaded {filename}")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
