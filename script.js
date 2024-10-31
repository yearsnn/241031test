var fonts = ["Futura", "Didot", "Verdana", "Baskerville", "Avenir", "Gill Sans", "Source Code Pro", "Cooper", "Helvetica", "Rockwell", "Didot"];
let size = 800;

var index;
let offscreen, mask;
let stringInput;
let rowsSlider;
let colsSlider;
let backgroundColor;
let textColor;
let fontGrid;
let h;
let secondaryCanvas;

function setup() {
    createCanvas(windowWidth, windowHeight);
    const smallCanvasElement = document.getElementById('smallCanvas');
    smallCanvasElement.width = 400; // 원하는 크기로 설정
    smallCanvasElement.height = 400;

    secondaryCanvas = createGraphics(300, 200); 
    offscreen = createGraphics(windowWidth, windowHeight);
    mask = createGraphics(windowWidth, windowHeight);
    offscreen.textAlign(CENTER, CENTER);


    
    stringInput = createInput('Here is your text');
    stringInput.style('width', `${windowWidth * 0.25}px`);
    stringInput.style('height', '30px');
    stringInput.position(windowWidth * 0.72, windowHeight * 0.72);
    stringInput.input(scramble);
    stringInput.mousePressed(() => {
        if (stringInput.value() === 'Here is your text') {
            stringInput.value('');
        }
        drawGraphic();
    });
    
    rowsSlider = createSlider(1, 10, 4, 1);
    rowsSlider.style('width', `${windowWidth * 0.25}px`);
    rowsSlider.position(windowWidth * 0.72, windowHeight * 0.79);
    rowsSlider.input(scramble);
    
    colsSlider = createSlider(1, 30, 10, 1);
    colsSlider.style('width', `${windowWidth * 0.25}px`);
    colsSlider.position(windowWidth * 0.72, windowHeight * 0.84);
    colsSlider.input(scramble);
    
    backgroundColor = createColorPicker('#f0f0f0');
    backgroundColor.position(windowWidth * 0.72, windowHeight * 0.89);
    backgroundColor.style('width', `${windowWidth * 0.12}px`);
    backgroundColor.input(drawGraphic);
    
    textColor = createColorPicker('#ff0000');
    textColor.position(windowWidth * 0.85, windowHeight * 0.89);
    textColor.style('width', `${windowWidth * 0.12}px`);
    textColor.input(drawGraphic);
    
    scramble();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    stringInput.style('width', `${windowWidth * 0.25}px`);
    stringInput.position(windowWidth * 0.72, windowHeight * 0.72);
    
    rowsSlider.style('width', `${windowWidth * 0.25}px`);
    rowsSlider.position(windowWidth * 0.72, windowHeight * 0.79);
    
    colsSlider.style('width', `${windowWidth * 0.25}px`);
    colsSlider.position(windowWidth * 0.72, windowHeight * 0.84);
    
    backgroundColor.style('width', `${windowWidth * 0.12}px`);
    backgroundColor.position(windowWidth * 0.72, windowHeight * 0.89);

    textColor.style('width', `${windowWidth * 0.12}px`);
    textColor.position(windowWidth * 0.85, windowHeight * 0.89);
    
    scramble();
}

function scramble() {
    fontGrid = new Array();
    var rows = rowsSlider.value();
    var cols = colsSlider.value();
    for (var j = 0; j < rows; j++) {
        fontGrid[j] = new Array();
        for (var i = 0; i < cols; i++) {
            fontGrid[j].push(fonts[floor(random(0, fonts.length))]);
        }
    }
    getHeight();
    drawGraphic();
}

function getHeight() {
    var x = 0;
    for (var i = 0; i < fonts.length; i++) {
        offscreen.textFont(fonts[i]);
        offscreen.textSize(windowWidth);
        offscreen.textSize(windowWidth * windowWidth / offscreen.textWidth(stringInput.value()));
        x = Math.max(x, offscreen.textAscent());
    }
    h = x;
}

function mouseClicked() {
    var rows = rowsSlider.value();
    var cols = colsSlider.value();
    var col = floor(mouseX / (windowWidth / cols));
    var row = floor((mouseY - (windowHeight * 0.3 - h / 2)) / (h / rows)); 

    if (row < rows && col < cols) {
        var font = fontGrid[row][col];
        do {
            var newFont = fonts[floor(random(0, fonts.length))];
        } while (fontGrid[row][col] === newFont);

        fontGrid[row][col] = newFont;
        drawGraphic();
    }
}

function getSector(row, col) {
    var rows = rowsSlider.value();
    var cols = colsSlider.value();
    var gridWidth = windowWidth * 0.8; 
    var gridHeight = h * 0.8;          
    var out = createGraphics(floor(gridWidth / cols), floor(gridHeight / rows));
    out.fill(color(textColor.value()));
    out.textFont(fontGrid[row][col]);
    out.textSize(gridWidth);
    out.textAlign(CENTER, CENTER);

    out.textSize(gridWidth * gridWidth / out.textWidth(stringInput.value()));
    out.text(stringInput.value(), gridWidth / 2 - col * gridWidth / cols, gridHeight / 2 - row * gridHeight / rows);
    return out.get();
}

function drawGraphic() {
    clear();
    background(color(backgroundColor.value()));

    const rows = rowsSlider.value();
    const cols = colsSlider.value();

    let gridWidth = windowWidth * 0.8;  
    let gridHeight = h * 0.8;           
    let gridXOffset = (windowWidth - gridWidth) / 2;  

    // 선 색상 설정
    stroke(color(textColor.value())); // 텍스트 색상으로 그리드 선 색상 설정
    strokeWeight(0.5); // 선 두께 설정

    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            fill(255, 0); // 투명한 사각형
            rect(gridXOffset + col * gridWidth / cols, windowHeight * 0.35 - gridHeight / 2 + row * gridHeight / rows, gridWidth / cols, gridHeight / rows);
            
            // 그리드 선 그리기
            line(gridXOffset + col * gridWidth / cols, windowHeight * 0.35 - gridHeight / 2 + row * gridHeight / rows, 
                 gridXOffset + col * gridWidth / cols, windowHeight * 0.35 - gridHeight / 2 + (row + 1) * gridHeight / rows); // 세로선
            line(gridXOffset + col * gridWidth / cols, windowHeight * 0.35 - gridHeight / 2, 
                 gridXOffset + (col + 1) * gridWidth / cols, windowHeight * 0.35 - gridHeight / 2); // 가로선

            image(getSector(row, col), gridXOffset + col * gridWidth / cols, windowHeight * 0.35 - gridHeight / 2 + row * gridHeight / rows, gridWidth / cols, gridHeight / rows);
        }
    }
}


function draw() {
    // 기존 그리기 코드
    // ...

    // smallCanvas에 현재 p5.js 캔버스의 내용을 복사
    const smallCanvasElement = document.getElementById('smallCanvas');
    const smallCanvasCtx = smallCanvasElement.getContext('2d');
    
    smallCanvasCtx.fillStyle = backgroundColor.value(); // 선택된 배경색으로 설정
    smallCanvasCtx.fillRect(0, 0, smallCanvasElement.width, smallCanvasElement.height); // 전체 배경색 채우기

    // p5.js 캔버스 내용을 smallCanvas에 그리기
    const yOffset = 85; // 위치를 내릴 만큼의 오프셋 (예: 20px)
    smallCanvasCtx.drawImage(canvas, 0, yOffset, smallCanvasElement.width, smallCanvasElement.height - yOffset); // Y축 위치 조정
}


function handleMouseMove(event) {
    const x = (window.innerWidth / 2 - event.pageX) / 30;
    const y = (window.innerHeight / 2 - event.pageY) / 30;
    smallCanvas.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`; 
}

document.addEventListener('mousemove', handleMouseMove);




const backgroundButton = document.getElementById('background-button');
const saveButton = document.getElementById('save-button');
const namelabelContainer = document.querySelector('.namelabel-container');

const backgrounds = [
    'url(111.jpg)',
    'url(222.jpg)',
    'url(333.jpg)',
    'url(444.jpg)',
    'url(555.jpg)',
    'url(666.jpg)',
    'url(777.jpg)',
    'url(888.jpg)',
    'url(999.jpg)',
    'url(101010.jpg)'
];

function changeBackground() {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    const selectedBackground = backgrounds[randomIndex];

    // namelabel-container의 배경 이미지 변경
    const namelabelContainer = document.querySelector('.namelabel-container');
    namelabelContainer.style.backgroundImage = selectedBackground;
    namelabelContainer.style.backgroundSize = 'cover';
    namelabelContainer.style.backgroundPosition = 'center';
}

backgroundButton.addEventListener('click', changeBackground);
saveButton.addEventListener('click', () => {
    // 버튼 숨기기
    backgroundButton.style.display = 'none';
    saveButton.style.display = 'none';

    // 랜덤 배경 이미지 로드
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    const bgImage = new Image();
    bgImage.src = backgrounds[randomIndex];

    bgImage.onload = () => {
        // namelabelContainer의 배경 이미지 설정
        namelabelContainer.style.backgroundImage = `url(${bgImage.src})`;
        namelabelContainer.style.backgroundSize = 'cover';
        namelabelContainer.style.backgroundPosition = 'center';

        // 0.1초 후에 캡처를 진행
        setTimeout(() => {
            html2canvas(namelabelContainer, {
                useCORS: true, // CORS 문제를 피하기 위해 설정
                scale: window.devicePixelRatio // 고해상도 캡처
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'nametag.png';
                link.href = canvas.toDataURL();
                link.click();

                // 버튼 다시 보이기
                backgroundButton.style.display = '';
                saveButton.style.display = '';
            });
        }, 100); // 100ms 지연
    };

    // 이미지 로드 실패 시 처리
    bgImage.onerror = () => {
        console.error('배경 이미지 로드 실패');
        // 버튼 다시 보이기
        backgroundButton.style.display = '';
        saveButton.style.display = '';
    };
});