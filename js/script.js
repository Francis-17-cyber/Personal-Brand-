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
        const fullName = "Francis SHABA Miyoba";

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

        // Fill in content for the rest of the files shown in the explorer
        placeholderFiles["subnets.tf"] = `resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "private-subnet"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.3.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-b"
  }
}`;

        placeholderFiles["security-groups.tf"] = `resource "aws_security_group" "web" {
  name        = "web-sg"
  description = "Allow HTTP/HTTPS inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`;

        placeholderFiles["ec2.tf"] = `resource "aws_instance" "app_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.public.id

  vpc_security_group_ids = [aws_security_group.web.id]

  tags = {
    Name = "app-server"
  }
}`;

        placeholderFiles["autoscaling.tf"] = `resource "aws_autoscaling_group" "app" {
  desired_capacity    = 2
  max_size            = 4
  min_size            = 1
  vpc_zone_identifier = [aws_subnet.public.id]

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }
}`;

        const fileLanguages = {

            "vpc.tf": "hcl",
            "subnets.tf": "hcl",
            "security-groups.tf": "hcl",
            "ec2.tf": "hcl",
            "autoscaling.tf": "hcl",
            "lambda_handler.py": "python",
            "deploy.yml": "yaml",
            "README.md": "markdown"
        };

        const languageDisplayNames = {
            "hcl": "Terraform",
            "python": "Python",
            "yaml": "YAML",
            "markdown": "Markdown"
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

        // -----------------------
        // Folder
        // -----------------------

        let fileContainer = null;

        if (section.folder !== "") {

            const folder = document.createElement("div");
            folder.className = "explorer-folder";

            folder.innerHTML = `
                <i class="codicon codicon-chevron-down folder-arrow"></i>
                <i class="codicon codicon-folder folder-icon"></i>
                <span>${section.folder}</span>
            `;

            tree.appendChild(folder);

            fileContainer = document.createElement("div");
            fileContainer.className = "folder-files";

            tree.appendChild(fileContainer);

            folder.addEventListener("click", () => {

                const arrow = folder.querySelector(".folder-arrow");

                fileContainer.classList.toggle("collapsed");

                if (fileContainer.classList.contains("collapsed")) {

                    arrow.classList.remove("codicon-chevron-down");
                    arrow.classList.add("codicon-chevron-right");

                } else {

                    arrow.classList.remove("codicon-chevron-right");
                    arrow.classList.add("codicon-chevron-down");

                }

            });

        }

        // -----------------------
        // Files
        // -----------------------

        section.files.forEach(file => {

            const item = document.createElement("div");

            item.className = "explorer-file";

            let icon = "codicon-file-code";
            let iconClass = "";

            if (file.endsWith(".tf")) {
                icon = "codicon-symbol-module";
                iconClass = "terraform-icon";
            }
            else if (file.endsWith(".py")) {
                icon = "codicon-symbol-method";
                iconClass = "python-icon";
            }
            else if (file.endsWith(".yml")) {
                icon = "codicon-settings-gear";
                iconClass = "yaml-icon";
            }
            else if (file.endsWith(".md")) {
                icon = "codicon-book";
                iconClass = "markdown-icon";
            }

            item.innerHTML = `
                <i class="codicon ${icon} ${iconClass}"></i>
                <span>${file}</span>
            `;

            item.style.paddingLeft = "32px";
            item.dataset.filename = file;

            item.addEventListener("click", () => openFile(file));

            if (fileContainer) {

                fileContainer.appendChild(item);

            } else {

                tree.appendChild(item);

            }

        });

    });

    setActiveExplorerItem(activeTab);

}

/* ===========================
      OPEN / SWITCH FILES
=========================== */

let pendingFile = null;

function setActiveExplorerItem(filename) {
    document.querySelectorAll(".explorer-file").forEach(el => {
        el.classList.toggle("active", el.dataset.filename === filename);
    });
}

function updateBreadcrumbs(filename) {
    const breadcrumbs = document.getElementById("breadcrumbs");
    if (!breadcrumbs) return;

    let folderName = "";
    explorerTree.forEach(section => {
        if (section.files.includes(filename)) {
            folderName = section.folder;
        }
    });

    breadcrumbs.textContent = folderName ? `${folderName} / ${filename}` : filename;
}

function updateStatusBarLanguage(filename) {
    const statusBar = document.getElementById("status-bar");
    if (!statusBar) return;
    const langEl = statusBar.querySelector("div:first-child");
    if (!langEl) return;
    const lang = fileLanguages[filename];
    langEl.textContent = languageDisplayNames[lang] || "Plain Text";
}

function openFile(filename) {
    if (!placeholderFiles[filename]) return;

    if (!openTabs.includes(filename)) {
        openTabs.push(filename);
    }
    activeTab = filename;

    renderTabs();
    setActiveExplorerItem(filename);
    updateBreadcrumbs(filename);
    updateStatusBarLanguage(filename);

    if (monacoEditor) {
        const model = monacoEditor.getModel();
        monaco.editor.setModelLanguage(model, fileLanguages[filename] || "plaintext");
        monacoEditor.setValue(placeholderFiles[filename]);
    } else {
        pendingFile = filename;
        checkAndLoadMonaco();
    }
}
        let monacoEditor = null;
        let monacoLoaded = false;

        function initMonaco() {
            if (monacoLoaded) return;
            monacoLoaded = true;

            require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
            require(['vs/editor/editor.main'], function () {
                const startFile = pendingFile || activeTab || "vpc.tf";

                monacoEditor = monaco.editor.create(document.getElementById('monaco-container'), {
                    value: placeholderFiles[startFile],
                    language: fileLanguages[startFile],
                    theme: 'vs-dark',
                    fontSize: 13,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    scrollBeyondLastLine: false
                });

                activeTab = startFile;
                pendingFile = null;
                renderTabs();
                setActiveExplorerItem(startFile);
                updateBreadcrumbs(startFile);
                updateStatusBarLanguage(startFile);
            });
        }

        // The VS Code panel only exists in light mode. Lazy-load Monaco
        // the first time it becomes visible (initial load, or after a
        // theme toggle), instead of loading it up front.
        function checkAndLoadMonaco() {
            const vscodeSection = document.getElementById('vscode-editor-section');
            if (!vscodeSection) return;

            const isVisible = window.getComputedStyle(vscodeSection).display !== 'none';
            if (isVisible && !monacoLoaded) {
                initMonaco();
            }
        }

/* ===========================
      VS CODE TAB SYSTEM
=========================== */

const openTabs = ["vpc.tf"];
let activeTab = "vpc.tf";

function renderTabs() {

    const tabBar = document.getElementById("tab-bar");

    tabBar.innerHTML = "";

    openTabs.forEach(file => {

        const tab = document.createElement("div");

        tab.className =
            file === activeTab
                ? "editor-tab active"
                : "editor-tab";

        tab.innerHTML = `
            <span>${file}</span>
        `;

        tab.addEventListener("click", () => openFile(file));

        tabBar.appendChild(tab);

    });

}   

/* ==========================
   START WEBSITE
========================== */

showNextWord();

buildExplorer();

checkAndLoadMonaco();

renderTabs();