from flask import Flask, render_template_string, send_from_directory

app = Flask(__name__)

html_code = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ZeeAi 1.2</title>
<link rel="icon" type="image/jpeg" href="https://image.jimcdn.com/app/cms/image/transf/none/path/s87e10734edef81fd/image/ic057f555847bdd10/version/1757224479/image.jpg">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#00ff55">
<script>
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/static/service-worker.js");
}
</script>
<style>
html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: 'Consolas', 'Monaco', 'Lucida Console', monospace;
    background-color: #0d0d0d;
    color: #e0e0e0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 3vh;
    box-sizing: border-box;
    position: relative;
}
body::before {
    content: '';
    position: absolute;
    top:0; left:0;
    width:100%; height:100%;
    background-image:
    linear-gradient(0deg, transparent 24%, rgba(30,255,12,0.05) 25%, rgba(30,255,12,0.05) 26%, transparent 27%, transparent 74%, rgba(30,255,12,0.05) 75%, rgba(30,255,12,0.05) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(30,255,12,0.05) 25%, rgba(30,255,12,0.05) 26%, transparent 27%, transparent 74%, rgba(30,255,12,0.05) 75%, rgba(30,255,12,0.05) 76%, transparent 77%, transparent);
    background-size: 50px 50px;
    opacity: 0.2;
    z-index: -1;
}
.heading {
    width: 90%;
    max-width: 600px;
    max-height: 12vh;
    text-align: center;
    font-size: clamp(1.5rem, 6vw, 3.5rem);
    font-weight: 700;
    letter-spacing: 2px;
    color: #00ff55;
    text-shadow: 0 0 5px #00ff55, 0 0 10px #00ff5599;
    margin-bottom: 2vh;
    animation: subtlePulse 2s infinite alternate ease-in-out;
}
@keyframes subtlePulse {
    from { text-shadow: 0 0 5px #00ff55, 0 0 10px #00ff5599; transform: scale(1); }
    to { text-shadow: 0 0 8px #00ff55, 0 0 15px #00ff55bb; transform: scale(1.01); }
}
#returnedText {
    width: 90%;
    max-width: 600px;
    text-align: center;
    margin-bottom: 2vh;
    font-size: 1rem;
    color: #00ccee;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    overflow: hidden;
}
#returnedText.visible { opacity: 1; }
.container {
    margin-top: 1vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    max-width: 600px;
    padding: 15px;
    background-color: rgba(18,18,18,0.9);
    border-radius: 10px;
    box-shadow: 0 0 25px rgba(0,255,85,0.2);
    border: 1px solid rgba(0,255,85,0.3);
    box-sizing: border-box;
}
input {
    padding: 14px;
    font-size: 1.1rem;
    border-radius: 8px;
    border: 2px solid #00ccee;
    background-color: #222;
    color: #e0e0e0;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 15px;
}
input::placeholder { color: #888; }
input:focus {
    outline: none;
    border-color: #00ccee;
    box-shadow: 0 0 12px rgba(0,204,238,0.6);
    background-color: #2a2a2a;
}
.enter {
    padding: 12px 24px;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 8px;
    border: none;
    background-color: #00ccee;
    color: #0d0d0d;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 1px;
    width: 100%;
    max-width: 300px;
}
.enter:hover {
    background-color: #00aabb;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,204,238,0.4);
}
.enter:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(0,204,238,0.3);
}
.enter::before {
    content: '';
    position: absolute;
    top:50%; left:50%;
    width:0; height:0;
    background-color: rgba(0,204,238,0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: all 0.4s ease-in-out;
}
.enter:hover::before { width:200%; height:200%; opacity:1; }
.textbyme {
    position: absolute;
    bottom: 5px;
    width: 100%;
    text-align: center;
    font-size: 10px;
    color: white;
}
@media(max-width:768px){
    .heading { font-size: clamp(1.2rem, 8vw, 3rem); max-height: 10vh; }
    input { font-size: 1rem; padding: 10px; }
    .enter { font-size: 1rem; padding: 10px; }
}
</style>
</head>
<body>
<h1 class="heading">ZeeAi 1.2</h1>
<div id="returnedText"></div>
<div class="container">
    <input id="txt" placeholder="Enter text" onkeypress="checkEnter(event)" />
    <button class="enter" onclick="speak()">Speak</button>
</div>
<p class="textbyme">Text To Speech Generator Made By Zeeshan Khan</p>
<script>
function speak() {
    let text = document.getElementById("txt").value;
    const returnedTextDiv = document.getElementById("returnedText");
    if(text.trim() === "") { alert("Please enter some text!"); return; }
    returnedTextDiv.textContent = `Speaking: "${text}"`;
    returnedTextDiv.classList.add('visible');
    let msg = new SpeechSynthesisUtterance(text);
    msg.onend = function() { returnedTextDiv.classList.remove('visible'); }
    window.speechSynthesis.speak(msg);
}
function checkEnter(e){ if(e.key==='Enter'){ speak(); } }
</script>
</body>
</html>
"""

@app.route("/")
def index():
    return render_template_string(html_code)

@app.route("/manifest.json")
def manifest():
    return send_from_directory(".", "manifest.json")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
