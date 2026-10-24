import type { Guide } from "./guides";

/** Guides for the web and text tools. Kept apart from the PDF guides so each file stays easy to read. */
export const WEB_GUIDES: Guide[] = [
  {
    slug: "url-encoding-explained-with-examples",
    lang: "en",
    title: "URL Encoding Explained With Examples",
    description:
      "What URL encoding is, with simple examples: encoded query strings, form bodies, spaces and plus signs, and how to decode a URL or put JSON and Base64 in one safely.",
    intro:
      "Web addresses can only carry a small set of plain characters. Everything else, like spaces, & signs, Hindi letters or emoji, has to be written as a percent sign and two hex digits. That is URL encoding (also called percent-encoding). This guide shows what it looks like, where you meet it, and how to decode it.",
    tool: "url-encoder-decoder",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["url-encoded-characters-list", "url-encode-decode-in-javascript-php-java-python", "decode-facebook-and-youtube-links"],
    body: [
      { t: "h2", text: "A simple URL encoded example" },
      {
        t: "p",
        text: "Say you want to search for tea & coffee. The & sign already means “next parameter” in a link, and the spaces are not allowed, so the text is written like this:",
      },
      { t: "code", label: "Plain text and its URL encoded value", text: "tea & coffee\ntea%20%26%20coffee" },
      {
        t: "p",
        text: "A space became %20, and & became %26. The number after the % is the character's code in hex. Letters, digits and - _ . ~ are left as they are. Text outside English, such as नमस्ते, is first turned into UTF-8 bytes and every byte gets its own code, which is why it turns into a long string like %E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87.",
      },
      { t: "h2", text: "Where you see URL encoded data" },
      {
        t: "ul",
        items: [
          "Query strings: everything after the ? in a link, for example /search?q=tea%20%26%20coffee&page=2. Each name=value pair is separated by &.",
          "Form data: when a form is sent, the body is often application/x-www-form-urlencoded, the same name=value&name=value layout, written in the request body instead of the link.",
          "Redirect and share links: long links from social sites carry another full address inside one parameter, encoded.",
          "APIs and logs: values with spaces or symbols appear encoded in server logs and API documentation.",
        ],
      },
      { t: "h2", text: "How to decode a URL" },
      {
        t: "ol",
        items: [
          "Open the URL Encoder & Decoder.",
          "Choose Decode and paste the encoded text or the whole link.",
          "Leave Component selected to decode every code, including %2F, %3A and %26. Choose Full URL only if you want the codes for : / ? & = # left as they are.",
          "If the link has parameters, a table lists each name and its decoded value.",
          "Press Copy result. If you still see %25 or %2520 in the result, the text was encoded twice: press Decode again.",
        ],
      },
      { t: "h2", text: "Space: %20 or +?" },
      {
        t: "p",
        text: "Both appear in real links. %20 is a space everywhere. A + means a space only in form data and query strings, a leftover from old HTML forms. In the path part of a link (before the ?), a + is just a plus sign. If you decode form data, turn on the plus option so that a+b becomes “a b”. If you decode a path, leave it off.",
      },
      { t: "tip", text: "A real plus sign inside a value must be written %2B. If it is left as +, the receiving page reads it as a space. This is the usual reason a value arrives with spaces where it should have a plus." },
      { t: "h2", text: "URL encoded JSON and Base64" },
      {
        t: "p",
        text: "JSON contains { } \" : and , which are not safe in a link, so JSON placed in a parameter must be URL encoded: {\"a\":1} becomes %7B%22a%22%3A1%7D. Decode it here, then paste the result into the JSON Formatter to read it.",
      },
      {
        t: "p",
        text: "Base64 is trickier because standard Base64 uses +, / and =, and all three have meaning in a URL. Either URL encode the Base64 text (+ becomes %2B, / becomes %2F, = becomes %3D), or use URL-safe Base64, which uses - and _ instead and drops the = padding. To read a Base64 value from a link: URL decode it first, then Base64 decode it.",
      },
      { t: "h2", text: "Component or Full URL?" },
      {
        t: "ul",
        items: [
          "Component (encodeURIComponent and decodeURIComponent) converts every unsafe character, including / ? & = # and :. Use it to encode one value, and to decode anything completely.",
          "Full URL (encodeURI and decodeURI) keeps those characters, so the address still works. Use it to make a whole address safe. When decoding, it leaves codes such as %2F and %3F as they are.",
          "Never run Component on a whole address, or https://example.com/a becomes https%3A%2F%2Fexample.com%2Fa and stops being a link.",
        ],
      },
      { t: "tip", text: "URL encoding is not encryption. Anyone can decode it in a second, so do not use it to hide a password or a token." },
    ],
  },
  {
    slug: "url-encoded-characters-list",
    lang: "en",
    title: "URL Encoded Characters: %20, %22, %2B, %40",
    description:
      "A plain list of URL encoded characters and their codes: space %20, double quote %22, percent %25, plus %2B, at sign %40, newline %0A, and why a dot is not encoded.",
    intro:
      "Seen %22 or %2B in a link and wondering what it means? Here is the full list of the codes people look up most, what each one stands for, and a few cases that surprise people, like the dot, the tilde and the newline.",
    tool: "url-encoder-decoder",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["url-encoding-explained-with-examples", "url-encode-decode-in-javascript-php-java-python", "decode-facebook-and-youtube-links"],
    body: [
      { t: "h2", text: "The codes people search for most" },
      {
        t: "table",
        head: ["Code", "Character", "Notes"],
        rows: [
          ["%20", "space", "Also written + in form data and query strings"],
          ["%22", "double quote \"", "Seen in URL encoded JSON, as in %22name%22"],
          ["%25", "percent sign %", "The % itself must be encoded; %2520 means the text was encoded twice"],
          ["%2B", "plus sign +", "A bare + means a space in query strings, so a real plus must be %2B"],
          ["%40", "at sign @", "Common in email addresses inside links, such as name%40example.com"],
          ["%26", "ampersand &", "Separates parameters, so a value that contains & must use %26"],
          ["%3D", "equals sign =", "Separates a name from its value"],
          ["%3F", "question mark ?", "Starts the query string"],
          ["%23", "hash #", "Starts the fragment, everything after it is not sent to the server"],
          ["%2F", "slash /", "Separates parts of a path"],
          ["%3A", "colon :", "As in https%3A%2F%2F"],
          ["%2C", "comma ,", ""],
          ["%3B", "semicolon ;", ""],
          ["%3C and %3E", "< and >", "Angle brackets"],
          ["%7B and %7D", "{ and }", "Curly braces, used in JSON"],
          ["%5B and %5D", "[ and ]", "Square brackets"],
          ["%27", "single quote '", "Strict encoders write it; encodeURIComponent leaves it as it is"],
          ["%0A", "new line (LF)", "The URL encoded newline. Windows text uses %0D%0A (CR then LF)"],
          ["%09", "tab", ""],
        ],
      },
      { t: "h2", text: "Is a dot encoded?" },
      {
        t: "p",
        text: "No. The dot (full stop) is one of the characters that is always safe, so it stays as . in the encoded text. You may still see %2E in a link; it simply decodes to a dot. Other characters that are never encoded: A to Z, a to z, 0 to 9, hyphen -, underscore _ and tilde ~.",
      },
      { t: "h2", text: "How do I encode a double quote?" },
      {
        t: "p",
        text: "A double quote is %22. Paste text with quotes into the URL Encoder & Decoder and choose Component: the quotes come out as %22. To go back, choose Decode.",
      },
      { t: "h2", text: "What is a URL encoded newline?" },
      {
        t: "p",
        text: "A line break is %0A on Linux, Mac and the web (LF). Text from Windows often has %0D%0A (CR then LF). Decode them and you get the line break back. In a text box, they appear as a new line.",
      },
      { t: "h2", text: "Why do I see %25 or %2520?" },
      {
        t: "p",
        text: "%25 is the percent sign. If you see %2520 where you expected %20, the text was encoded twice: the first round turned a space into %20, and the second turned its % into %25. Decode once to get %20, then once more for the space. The Decode again button does the second round for you.",
      },
      { t: "h2", text: "Letters outside English" },
      {
        t: "p",
        text: "Each character is converted to UTF-8 bytes and each byte is written as a code. é is %C3%A9 (two bytes). Hindi letters take three bytes each, so न is %E0%A4%A8, and emoji take four. This is why a short Hindi word turns into a very long encoded string. It decodes back exactly.",
      },
      { t: "tip", text: "Paste any code from this page into the URL Encoder & Decoder to check it yourself, with Decode selected." },
    ],
  },
  {
    slug: "url-encode-decode-in-javascript-php-java-python",
    lang: "en",
    title: "URL Encode & Decode in JavaScript, PHP, Java",
    description:
      "Copy-ready code to URL encode and decode in JavaScript, PHP, Java, Python, C#/.NET, Ruby, Rust and Dart (Flutter), with the difference between %20 and + explained.",
    intro:
      "Every language has a function for this, but they differ in one important way: some write a space as %20 and some as +. Below is the right call for each language, using the same text, tea & coffee, so the results are easy to compare.",
    tool: "url-encoder-decoder",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["url-encoding-explained-with-examples", "url-encoded-characters-list", "decode-facebook-and-youtube-links"],
    body: [
      { t: "h2", text: "Quick answer" },
      {
        t: "table",
        head: ["Language", "Encode a value", "Decode a value"],
        rows: [
          ["JavaScript", "encodeURIComponent(s)", "decodeURIComponent(s)"],
          ["PHP", "rawurlencode($s)", "rawurldecode($s)"],
          ["Java", "URLEncoder.encode(s, UTF_8)", "URLDecoder.decode(s, UTF_8)"],
          ["Python", "urllib.parse.quote(s, safe=\"\")", "urllib.parse.unquote(s)"],
          ["C# / .NET", "Uri.EscapeDataString(s)", "Uri.UnescapeDataString(s)"],
          ["Ruby", "URI.encode_www_form_component(s)", "URI.decode_www_form_component(s)"],
          ["Rust", "urlencoding::encode(s)", "urlencoding::decode(s)"],
          ["Dart / Flutter", "Uri.encodeComponent(s)", "Uri.decodeComponent(s)"],
        ],
      },
      { t: "h2", text: "Decode URL in JavaScript" },
      {
        t: "code",
        label: "JavaScript",
        text: "encodeURIComponent(\"tea & coffee\");        // \"tea%20%26%20coffee\"\ndecodeURIComponent(\"tea%20%26%20coffee\");   // \"tea & coffee\"\n\n// Read the parameters of a link\nconst url = new URL(\"https://example.com/search?q=tea%20%26%20coffee&page=2\");\nurl.searchParams.get(\"q\");     // \"tea & coffee\"\n\n// Build a query string (spaces become +)\nnew URLSearchParams({ q: \"tea & coffee\" }).toString();  // \"q=tea+%26+coffee\"",
      },
      {
        t: "p",
        text: "decodeURIComponent throws a URIError if the text has a bad % code, for example a lone %. Wrap it in try and catch when the text comes from a user. Use encodeURI and decodeURI only for a whole address, since they leave : / ? & = # alone.",
      },
      { t: "h2", text: "URL encode and decode in PHP" },
      {
        t: "code",
        label: "PHP",
        text: "rawurlencode(\"tea & coffee\");   // \"tea%20%26%20coffee\" (space is %20)\nurlencode(\"tea & coffee\");      // \"tea+%26+coffee\"     (space is +)\nrawurldecode(\"tea%20%26%20coffee\");\nurldecode(\"tea+%26+coffee\");      // \"tea & coffee\"\n\n// Decode the query string of a link into an array\nparse_str(\"q=tea%20%26%20coffee&page=2\", $params);\n// $params[\"q\"] is \"tea & coffee\"\n\n// Build a query string\nhttp_build_query([\"q\" => \"tea & coffee\"]);  // \"q=tea+%26+coffee\"",
      },
      {
        t: "p",
        text: "Use rawurlencode for paths and urlencode for form-style values. urldecode also turns + into a space, which is right for query strings and wrong for a path.",
      },
      { t: "h2", text: "URL encode and decode in Java" },
      {
        t: "code",
        label: "Java",
        text: "import java.net.URLEncoder;\nimport java.net.URLDecoder;\nimport java.nio.charset.StandardCharsets;\n\nString e = URLEncoder.encode(\"tea & coffee\", StandardCharsets.UTF_8);\n// \"tea+%26+coffee\"  (URLEncoder writes + for a space)\nString path = e.replace(\"+\", \"%20\");   // \"tea%20%26%20coffee\"\n\nString d = URLDecoder.decode(\"tea+%26+coffee\", StandardCharsets.UTF_8);\n// \"tea & coffee\"",
      },
      {
        t: "p",
        text: "The version that takes StandardCharsets exists from Java 10. On older Java, pass \"UTF-8\" as a string and handle UnsupportedEncodingException. Always give a charset: the default can differ by machine.",
      },
      { t: "h2", text: "Python" },
      {
        t: "code",
        label: "Python",
        text: "from urllib.parse import quote, quote_plus, unquote, unquote_plus, parse_qs\n\nquote(\"tea & coffee\", safe=\"\")   # 'tea%20%26%20coffee'\nquote_plus(\"tea & coffee\")      # 'tea+%26+coffee'\nunquote(\"tea%20%26%20coffee\")    # 'tea & coffee'\nunquote_plus(\"tea+%26+coffee\")   # 'tea & coffee'\n\nparse_qs(\"a=1&b=x%20y&a=2\")      # {'a': ['1', '2'], 'b': ['x y']}",
      },
      { t: "tip", text: "quote leaves / alone by default. Pass safe=\"\" when you are encoding one value, so a slash inside it is encoded too." },
      { t: "h2", text: "C# and .NET" },
      {
        t: "code",
        label: "C#",
        text: "Uri.EscapeDataString(\"tea & coffee\");          // \"tea%20%26%20coffee\"\nUri.UnescapeDataString(\"tea%20%26%20coffee\");  // \"tea & coffee\"\n\n// System.Net.WebUtility (space becomes +)\nWebUtility.UrlEncode(\"tea & coffee\");           // \"tea+%26+coffee\"\nWebUtility.UrlDecode(\"tea+%26+coffee\");         // \"tea & coffee\"",
      },
      { t: "h2", text: "Ruby" },
      {
        t: "code",
        label: "Ruby",
        text: "require \"uri\"\nrequire \"erb\"\n\nURI.encode_www_form_component(\"tea & coffee\")   # \"tea+%26+coffee\"\nURI.decode_www_form_component(\"tea+%26+coffee\")  # \"tea & coffee\"\nERB::Util.url_encode(\"tea & coffee\")             # \"tea%20%26%20coffee\"",
      },
      {
        t: "p",
        text: "Older tutorials use URI.encode. It was removed in Ruby 3.0, so use the calls above.",
      },
      { t: "h2", text: "Rust" },
      {
        t: "code",
        label: "Rust (urlencoding crate)",
        text: "// Cargo.toml: urlencoding = \"2\"\nuse urlencoding::{decode, encode};\n\nlet e = encode(\"tea & coffee\");                 // \"tea%20%26%20coffee\"\nlet d = decode(\"tea%20%26%20coffee\").unwrap();   // \"tea & coffee\"",
      },
      {
        t: "p",
        text: "decode returns a Result, because the bytes may not be valid UTF-8. The percent-encoding crate gives finer control over which characters are encoded.",
      },
      { t: "h2", text: "Dart and Flutter" },
      {
        t: "code",
        label: "Dart",
        text: "Uri.encodeComponent(\"tea & coffee\");           // \"tea%20%26%20coffee\"\nUri.decodeComponent(\"tea%20%26%20coffee\");     // \"tea & coffee\"\n\n// Whole address: keeps : / ? & = #\nUri.encodeFull(\"https://example.com/a b\");     // \"https://example.com/a%20b\"",
      },
      { t: "h2", text: "Check your result without writing code" },
      {
        t: "p",
        text: "When you are not sure what a function should return, paste the text into the URL Encoder & Decoder. Component matches encodeURIComponent, Full URL matches encodeURI, and the plus option matches the form-style functions such as urlencode and quote_plus.",
      },
      { t: "tip", text: "Encode each value separately and put the encoded values into the link yourself. Encoding a whole finished link in one go breaks the : / ? and & that make it work." },
    ],
  },
  {
    slug: "decode-facebook-and-youtube-links",
    lang: "en",
    title: "How to Decode a Facebook, YouTube or Any Long Link",
    description:
      "Why some Facebook and YouTube links look like a mess of %3A and %2F, how to decode them to see the real address, and what decoding does not tell you.",
    intro:
      "Links that you copy from Facebook, from a YouTube description or from a search result often do not point straight to the site. They go through the platform first, and the real address sits inside, URL encoded. Decoding shows you where the link really goes before you tap it.",
    tool: "url-encoder-decoder",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["url-encoding-explained-with-examples", "url-encoded-characters-list", "url-encode-decode-in-javascript-php-java-python"],
    body: [
      { t: "h2", text: "What these links look like" },
      {
        t: "p",
        text: "A link shared on Facebook is often wrapped by the platform. The real address is in the u parameter:",
      },
      { t: "code", label: "Facebook outbound link (shortened)", text: "https://l.facebook.com/l.php?u=https%3A%2F%2Fexample.com%2Foffer%3Fid%3D12&h=AT0abc..." },
      { t: "p", text: "YouTube does the same for links in video descriptions. The destination is in the q parameter:" },
      { t: "code", label: "YouTube redirect link (shortened)", text: "https://www.youtube.com/redirect?event=video_description&redir_token=...&q=https%3A%2F%2Fexample.com%2Fpage&v=VIDEO_ID" },
      {
        t: "p",
        text: "Google search results used to work the same way, with the destination in a q or url parameter. Many other sites, such as email tracking tools, do it too.",
      },
      { t: "h2", text: "How to find the real address" },
      {
        t: "ol",
        items: [
          "Copy the whole link. On a phone, press and hold the link and choose Copy link address, rather than opening it.",
          "Open the URL Encoder & Decoder and choose Decode.",
          "Paste the link. The parameters table lists each part: look for u, q, url or redir.",
          "The decoded value of that parameter is the real address. In the example above it is https://example.com/offer?id=12.",
        ],
      },
      { t: "h2", text: "What decoding can and cannot tell you" },
      {
        t: "ul",
        items: [
          "It shows the real destination, so you can see whether the address matches what the message claims.",
          "It does not say whether the site is safe. A normal-looking address can still be a scam page.",
          "It does not remove tracking. Parts like fbclid or h are tokens added by the platform; the destination page may use them, and the redirect may need them.",
          "Skipping the platform's redirect page also skips any safety check it may do on the link.",
        ],
      },
      { t: "tip", text: "Do not open links from unknown senders just because the decoded address looks normal. When a message asks for a password, a card number or an OTP, treat it as a scam." },
      { t: "h2", text: "If the decoded text still has % signs" },
      {
        t: "p",
        text: "Some links are encoded twice: the address is encoded, then the whole parameter is encoded again. If you still see %3A or %2F after decoding, press Decode again. See the guide on URL encoded characters for what each code means.",
      },
      { t: "h2", text: "Decode a link with a Base64 part" },
      {
        t: "p",
        text: "Some tracking links hide the destination as Base64 text instead. URL decode the link first, then paste the Base64 part into the Base64 Encoder & Decoder. A + inside Base64 that turned into a space in the link should be put back as + before decoding.",
      },
    ],
  },
  {
    slug: "reduce-image-size-to-100kb",
    lang: "en",
    title: "How to Reduce Image Size to 100KB",
    description:
      "Reduce a photo to 100 KB (or 50, 30, 20 KB) on a phone or computer without uploading it. What makes files big, JPG vs PNG, and how to keep the picture clear.",
    intro:
      "Job portals, college forms and email often refuse a photo over 100 KB, while a phone photo is 3 to 8 MB. Here is how to get a picture under 100 KB on your own device, and how to keep it looking good.",
    tool: "resize-image-under-100kb",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["photo-and-signature-size-for-online-forms"],
    body: [
      { t: "h2", text: "Why the photo is so big" },
      {
        t: "p",
        text: "File size depends on two things: how many pixels the picture has, and how much detail is kept for each of them. A 12 megapixel phone photo has about 12 million pixels, so it weighs several MB. To reach 100 KB, one or both have to come down. Lowering the quality saves space with little visible change at first. Making the picture smaller in pixels saves much more, and is fine when the picture will only be seen on a screen.",
      },
      { t: "h2", text: "How to reduce image size to 100 KB" },
      {
        t: "ol",
        items: [
          "Open Resize & Compress Image to 100KB.",
          "Press Select photos and choose the picture from your gallery or files. You can pick several at once.",
          "100 KB is already selected. For 20, 30, 50 or 200 KB, tap that size, or type your own number under Other.",
          "If the form also asks for a width and height in pixels, enter them as the maximum width and height.",
          "Press Resize. Each picture shows the old and the new size.",
          "Press Download, or Download all (ZIP) if you chose many.",
        ],
      },
      { t: "p", text: "Nothing is uploaded. The picture is processed on your phone or computer, which matters for photos of people and documents." },
      { t: "h2", text: "JPG, JPEG or PNG?" },
      {
        t: "p",
        text: "JPG and JPEG are the same format. It is the right choice for photos because it stores them in much less space. PNG keeps every pixel exactly, which makes photos very large, so a PNG photo is often several MB. The tool turns a PNG into a JPG to reach your size, and fills any transparent area with white. PNG is better for logos and screenshots with flat colours, but if a form asks for a small file, a JPG is the way to get there.",
      },
      { t: "h2", text: "How to keep the picture clear" },
      {
        t: "ul",
        items: [
          "Crop first. A close crop of the face or the document spends the size limit on what matters.",
          "Use a plain, light background. Plain areas compress well, a busy background eats the budget.",
          "Take the photo in good light. Dark, grainy photos compress badly and look blotchy when small.",
          "Do not resize twice. Start from the original, not from a copy that was already compressed.",
          "Choose the largest size the form allows. 100 KB looks better than 30 KB.",
        ],
      },
      { t: "h2", text: "Smaller targets: 50, 30 and 20 KB" },
      {
        t: "p",
        text: "At 50 KB a face and a signature are usually still clear. At 30 KB and 20 KB the picture becomes small in pixels as well as lower in quality, because the quality alone cannot get a large photo that low. That is normal. If the result looks too soft, try a closer crop or a plain background before lowering the size again.",
      },
      { t: "h2", text: "Is 100 KB 100,000 or 102,400 bytes?" },
      {
        t: "p",
        text: "Systems differ: some count 1 KB as 1000 bytes, others as 1024. The tool keeps the result under 100,000 bytes, so it passes either way. The size shown next to the picture uses 1024, so it may read a little lower, such as 97 KB.",
      },
      { t: "tip", text: "If the form says the file must be between a minimum and a maximum size, such as 20 KB to 50 KB, choose a target a little under the maximum and check the size shown. The tool makes files smaller, it cannot make them bigger." },
    ],
  },
  {
    slug: "photo-and-signature-size-for-online-forms",
    lang: "en",
    title: "Photo and Signature Size for Online Forms",
    description:
      "How to prepare a passport-style photo and a signature for an online form: size in KB, width and height, background, and how to resize them without uploading.",
    intro:
      "Application forms often ask for a photo and a signature with a small file size, a fixed format and sometimes exact pixel sizes. This guide explains how to prepare both so that the upload is accepted the first time.",
    tool: "resize-image-under-100kb",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["reduce-image-size-to-100kb"],
    body: [
      { t: "h2", text: "First, read what your form asks for" },
      {
        t: "p",
        text: "Every form sets its own rules, and they change from year to year. Before you start, write down four things from the form's own instructions: the file format (usually JPG), the file size (a maximum, sometimes a minimum too), the width and height in pixels if they are given, and any rule for the background and the face. Use those numbers, not the ones from a guide or a friend.",
      },
      { t: "h2", text: "Preparing the photo" },
      {
        t: "ul",
        items: [
          "Stand in front of a plain light wall, with light falling on your face, not from behind you.",
          "Hold the phone at eye level, and keep your face straight and inside the frame.",
          "Take it at the phone's normal camera setting. Do not use filters or beauty modes.",
          "Crop so your head and shoulders fill the picture, the way the form's sample shows.",
        ],
      },
      { t: "h2", text: "Preparing the signature" },
      {
        t: "ul",
        items: [
          "Sign with a dark pen on plain white paper, in good light.",
          "Take the picture straight from above so the paper does not look slanted.",
          "Crop close around the signature so little white is left around it.",
        ],
      },
      { t: "h2", text: "Resizing both" },
      {
        t: "ol",
        items: [
          "Open Resize & Compress Image to 100KB.",
          "Add the photo and the signature together.",
          "Choose the size the form asks for, for example 50 KB, or type it under Other.",
          "If the form gives pixel sizes, enter them as the maximum width and height. The picture is fitted inside them and is never stretched.",
          "Press Resize and check the size and the dimensions shown next to each picture.",
          "Download each one and look at it before you upload. Zoom in on the face and the signature to be sure they are clear.",
        ],
      },
      { t: "h2", text: "If the form wants an exact width and height" },
      {
        t: "p",
        text: "The tool fits the picture inside the maximum width and height, keeping its shape, so the result may be slightly smaller than the box on one side. If the form needs exactly, for example, a fixed width and height, crop the picture to the right shape first so that its proportions match, then resize it here.",
      },
      { t: "h2", text: "Common reasons an upload is refused" },
      {
        t: "ul",
        items: [
          "The file is over the maximum size: choose a smaller target and try again.",
          "The file is under the minimum size: this tool cannot make a file bigger, so choose a target just under the maximum rather than very small.",
          "The format is wrong: HEIC photos from iPhones are not accepted by most forms, so save or share the picture as JPG first.",
          "The picture is the wrong shape: crop it before resizing.",
        ],
      },
      { t: "tip", text: "Keep the original photos. If the form asks again with different rules, start from the original rather than from a picture that was already made small." },
    ],
  },
  {
    slug: "make-passport-size-photo-at-home",
    lang: "en",
    title: "How to Make a Passport Size Photo at Home (35x45 mm)",
    description:
      "Make a 35x45 mm passport size photo at home with your phone: taking the photo, cropping the face, name and date, KB limits and printing 8 on a 4x6 sheet.",
    intro:
      "Most Indian forms, ID cards and many visa applications ask for a 35 x 45 mm photo. You can make one at home with a phone and print a full sheet at any photo shop for a few rupees. Here is how to get it right the first time.",
    tool: "passport-size-photo-maker",
    published: "2026-10-24",
    updated: "2026-10-24",
    related: ["photo-and-signature-size-for-online-forms", "reduce-image-size-to-100kb"],
    body: [
      { t: "h2", text: "The size: 35 x 45 mm" },
      {
        t: "table",
        head: ["Measure", "Value"],
        rows: [
          ["Millimetres", "35 x 45 mm"],
          ["Centimetres", "3.5 x 4.5 cm"],
          ["Inches", "1.38 x 1.77 in"],
          ["Pixels at 300 DPI", "413 x 531 px"],
          ["Head, top of hair to chin", "About 32 to 36 mm"],
        ],
      },
      { t: "p", text: "If your form gives a different size, in mm or in pixels, use the form's numbers. Rules differ between exams, departments and countries, and they change." },
      { t: "h2", text: "Taking the photo" },
      {
        t: "ul",
        items: [
          "Stand about half a metre in front of a plain white or light wall. The tool does not change the background, so the wall is the background.",
          "Face a window in daylight, so the light falls evenly on your face. Avoid light from behind you and harsh shadows.",
          "Ask someone to hold the phone at your eye level, about 1 to 1.5 metres away. A selfie camera held close makes the nose look bigger.",
          "Look straight at the camera with a neutral face, both ears visible if your form asks, eyes open, no filters or beauty mode.",
          "Leave room above the head and below the shoulders. You will crop later.",
        ],
      },
      { t: "h2", text: "Cropping it to 35 x 45 mm" },
      {
        t: "ol",
        items: [
          "Open the Passport Size Photo Maker and choose the photo.",
          "Drag the photo and zoom (pinch on a phone) until the top of the hair touches the upper guide line and the chin touches the lower one.",
          "Line up the nose with the middle line. Use Straighten if your head is tilted, and Brightness if the photo is dark.",
          "If the form wants your name and the date on the photo, tick Add name and date and type them.",
        ],
      },
      { t: "h2", text: "For an online form" },
      {
        t: "p",
        text: "Under Single photo for online forms, pick the KB limit the form gives, for example 20 KB or 50 KB, and press Download photo. The tool keeps the best quality that fits and tells you the final size in KB and pixels. If the form also asks for exact pixel sizes, resize the downloaded photo with Resize & Compress Image to 100KB.",
      },
      { t: "h2", text: "For printing" },
      {
        t: "ol",
        items: [
          "Under Print sheet, choose 4 x 6 inch (8 photos) or A4 (30 photos), or type how many photos you want.",
          "Press Download PDF. The PDF is made in exact millimetres.",
          "At a photo shop, ask for a 4 x 6 (also called 4R or postcard size) glossy print of the PDF or JPG. At home, print the A4 PDF on photo paper.",
          "In the print window choose Actual size or 100%. Fit to page, Shrink or borderless printing changes the size.",
          "Measure one photo with a ruler. It should be 35 mm wide and 45 mm tall. Cut along the thin grey lines.",
        ],
      },
      { t: "h2", text: "Name and date on the photo" },
      {
        t: "p",
        text: "Some exam forms, such as many SSC and state exam forms, ask for the candidate's name and the date the photo was taken printed below the face. Others refuse photos with any text. Do what your notification says. The tool prints the name in bold and the date below it in a white strip, so the face is not covered.",
      },
      { t: "h2", text: "Common mistakes" },
      {
        t: "ul",
        items: [
          "The face is too small: zoom in until the head fills the space between the guide lines.",
          "A coloured or busy background: take the photo again in front of a plain light wall.",
          "Wrong print size: the print was set to Fit to page. Print again at Actual size.",
          "Shadows on the face or wall: move away from the wall a little and face the light.",
          "An old photo: many forms want a recent photo, often taken within the last few months.",
        ],
      },
      { t: "tip", text: "For a new or renewed Indian passport, the photo is usually taken at the Passport Seva Kendra during your appointment, so check the official instructions before you print one for it." },
    ],
  },
];
