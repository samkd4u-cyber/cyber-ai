# Mera AI: free chat app (PWA)

## 1. Free API key lein
https://aistudio.google.com/apikey par Google account se login karke "Create API key". (Free tier ki limits badalti rehti hain, wahan check kar lein.)

## 2. Code GitHub par daalein
GitHub par naya repo banayein aur is poore folder ki files upload karein (api/, public/, package.json).

## 3. Vercel par free deploy
1. vercel.com par GitHub se login karein
2. "Add New > Project" mein apna repo chunein
3. Settings > Environment Variables mein ye daalein:
   - API_KEY = aap ki key (zaroori)
   - MODEL = gemini-2.0-flash (optional, model ka naam provider ki site se check karein)
   - HOURLY_LIMIT = 40 (optional, har user ke liye ghante ke sawal)
4. Deploy dabayein. Aap ko link mil jayega (jaise myai.vercel.app)

## 4. Phone par install
- Android Chrome: link kholein > menu > "Install app"
- iPhone Safari: Share > "Add to Home Screen"

## Doosra provider (sirf env vars badlein)
| Provider | API_BASE | MODEL (misal) |
|---|---|---|
| Gemini (default) | https://generativelanguage.googleapis.com/v1beta/openai | gemini-2.0-flash |
| Groq | https://api.groq.com/openai/v1 | llama-3.3-70b-versatile |
| OpenRouter | https://openrouter.ai/api/v1 | koi ":free" model |
Model ke naam badalte rehte hain, provider ki site par dekh lein. Tasveer sirf unhi models par chalti hai jo vision support karte hain.

## Free Android APK
pwabuilder.com par apna Vercel link daalein > Android package download karein.

## Note
- API key kabhi frontend ya GitHub mein na likhein, sirf Vercel env vars mein.
- Rate limit in-memory hai (best effort). Zyada users hon to Upstash Redis free tier lagayein.
