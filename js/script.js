// — Theme Toggle —
        const toggleButton = document.getElementById('theme-toggle');
        const body = document.body;
        toggleButton.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            checkAndLoadMonaco();
        });

        // — Intro Splash Screen —
        const words = [
            { text: "Hello",      lang: "English"    },
            { text: "Hola",       lang: "Spanish"    },
            { text: "Bonjour",    lang: "French"     },
            { text: "Ciao",       lang: "Italian"    },
            { text: "Hallo",      lang: "German"     },
            { text: "Olá",        lang: "Portuguese" },
            { text: "مرحبا",      lang: "Arabic"     },
            { text: "こんにちは",  lang: "Japanese"   },
            { text: "안녕하세요",  lang: "Korean"     },
            { text: "Jambo",      lang: "Swahili"    },
        ];

        const overlay  = document.getElementById('intro-overlay');
        const wordEl   = document.getElementById('intro-word');
        const nameEl   = document.getElementById('intro-name');
        const fullName = "Francis Shaba Miyoba";

        let currentIndex = 0;

        function showNextWord() {
            if (currentIndex >= words.length) {
                wordEl.classList.add('hidden');
                setTimeout(startTypewriter, 400);
                return;
            }
            const word = words[currentIndex];
            wordEl.textContent = word.text;
            wordEl.classList.remove('hidden');
            setTimeout(() => {
                wordEl.classList.add('hidden');
                currentIndex++;
                setTimeout(showNextWord, 350);
            }, 500);
        }

        function startTypewriter() {
            let i = 0;
            const speed = 80;
            function typeChar() {
                if (i < fullName.length) {
                    nameEl.textContent += fullName.charAt(i);
                    i++;
                    setTimeout(typeChar, speed);
                } else {
                    setTimeout(closeOverlay, 1200);
                }
            }
            typeChar();
        }

        function closeOverlay() {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.remove();
            }, 800);
        }

        // — Rotating Word —
        const rotatingWords = ["Secure", "Resilient", "Compliant"];
        let wordIndex = 0;
        const rotatingEl = document.getElementById('rotating-word');

        function rotateWord() {
            rotatingEl.classList.add('slide-out');
            setTimeout(() => {
                wordIndex = (wordIndex + 1) % rotatingWords.length;
                rotatingEl.textContent = rotatingWords[wordIndex];
                rotatingEl.classList.remove('slide-out');
                rotatingEl.classList.add('slide-in-from-below');
                rotatingEl.getBoundingClientRect();
                rotatingEl.classList.remove('slide-in-from-below');
            }, 500);
        }

        setInterval(rotateWord, 2500);

        // — Live VS Code Editor (Monaco) —
        const placeholderFiles = {
            "vpc.tf": `resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "main-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "public-subnet"
  }
}`,
            "lambda_handler.py": `import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('MovieCatalog')

def lambda_handler(event, context):
    response = table.scan()
    items = response.get('Items', [])

    return {
        'statusCode': 200,
        'body': json.dumps(items)
    }`,
            "deploy.yml": `name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-region: us-east-1
      - name: Deploy
        run: aws s3 sync ./build s3://my-bucket`,
            "README.md": `# AWS Projects

A collection of cloud architecture projects covering
VPC design, serverless deployments, and CI/CD pipelines.

## Stack
- Terraform
- AWS Lambda
- GitHub Actions`
        };

        const fileLanguages = {

            "vpc.tf": "hcl",
            "lambda_handler.py": "python",
            "deploy.yml": "yaml",
            "README.md": "markdown"
        };

       const explorerTree = [

    {
        folder: "networking",
        files: [
            "vpc.tf",
            "subnets.tf",
            "security-groups.tf"
        ]
    },

    {
        folder: "compute",
        files: [
            "ec2.tf",
            "autoscaling.tf"
        ]
    },

    {
        folder: "serverless",
        files: [
            "lambda_handler.py"
        ]
    },

    {
        folder: "pipelines",
        files: [
            "deploy.yml"
        ]
    },

    {
        folder: "",
        files: [
            "README.md"
        ]
    }

]; 
function buildExplorer() {

    const tree = document.getElementById("file-tree");

    tree.innerHTML = "";

    explorerTree.forEach(section => {

        // Folder
        if (section.folder !== "") {

const folder = document.createElement("div");

folder.className = "explorer-folder";

folder.innerHTML = `
    <i class="codicon codicon-chevron-down folder-arrow"></i>
    <i class="codicon codicon-folder folder-icon"></i>
    <span>${section.folder}</span>
`;

tree.appendChild(folder);

        }
        
        // Files
        section.files.forEach(file => {

            const item = document.createElement("div");

            item.className = "explorer-file";

            let icon = "codicon-file-code";
let iconClass = "";

if(file.endsWith(".tf")){
    icon = "codicon-symbol-module";
    iconClass = "terraform-icon";
}
else if(file.endsWith(".py")){
    icon = "codicon-symbol-method";
    iconClass = "python-icon";
}
else if(file.endsWith(".yml")){
    icon = "codicon-settings-gear";
    iconClass = "yaml-icon";
}
else if(file.endsWith(".md")){
    icon = "codicon-book";
    iconClass = "markdown-icon";
}

item.innerHTML = `
    <i class="codicon ${icon} ${iconClass}"></i>
    <span>${file}</span>
`;

            item.style.paddingLeft = "32px";

tree.appendChild(item);

        });

    });

}
        let monacoEditor = null;
        let monacoLoaded = false;

        function initMonaco() {
            if (monacoLoaded) return;
            monacoLoaded = true;

            require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
            require(['vs/editor/editor.main'], function () {
                monacoEditor = monaco.editor.create(document.getElementById('monaco-container'), {
                    value: placeholderFiles["vpc.tf"],
                    language: fileLanguages["vpc.tf"],
                    theme: 'vs-dark',
                    fontSize: 13,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    scrollBeyondLastLine: false
                });
            });
        }

/* ===========================
      VS CODE TAB SYSTEM
=========================== */

const openTabs = ["vpc.tf"];
let activeFile = "vpc.tf";

function renderTabs() {

    const tabbar = document.getElementById("vscode-tabbar");

    tabbar.innerHTML = "";

    openTabs.forEach(file => {

        const tab = document.createElement("div");

        tab.className =
            file === activeFile
            ? "vscode-tab active"
            : "vscode-tab";

        tab.dataset.file = file;

        tab.innerHTML = `
            <span>${file}</span>
            <i class="codicon codicon-close tab-close"></i>
        `;

        /* Click tab */

        tab.addEventListener("click", (e) => {

            if(e.target.classList.contains("tab-close")) return;

            activeFile = file;

            renderTabs();

            document.querySelectorAll(".sidebar-file")
                .forEach(f=>{

                    f.classList.toggle(
                        "active",
                        f.dataset.file===file
                    );

                });

            monacoEditor.setValue(
                placeholderFiles[file]
            );

            monaco.editor.setModelLanguage(

                monacoEditor.getModel(),

                fileLanguages[file]

            );

        });

        /* Close */

        tab.querySelector(".tab-close")
        .addEventListener("click",(e)=>{

            e.stopPropagation();

            const index=openTabs.indexOf(file);

            if(index>-1){

                openTabs.splice(index,1);

            }

            if(activeFile===file){

                activeFile=openTabs[0] || "";

            }

            if(activeFile){

                monacoEditor.setValue(

                    placeholderFiles[activeFile]

                );

                monaco.editor.setModelLanguage(

                    monacoEditor.getModel(),

                    fileLanguages[activeFile]

                );

            }

            renderTabs();

        });

        tabbar.appendChild(tab);

    });

}   

/* ==========================
   START WEBSITE
========================== */

showNextWord();

buildExplorer();

checkAndLoadMonaco();

renderTabs();