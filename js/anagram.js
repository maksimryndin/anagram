var words = {3: ['хор', 'рот', 'ухо'],
             4: ['лист', 'перо', 'туча'],
             5: ['палка', 'доска', 'рубин'],
             6: ['гвоздь', 'машина', 'одеяло']}

var button = document.querySelector("#level-btn");
var levelForm = document.querySelector("#level-picker")
var home = document.querySelector('#home');

home.addEventListener('click', function() {
    var container = document.querySelector('#container');
    if (container)
        container.parentNode.removeChild(container);
    levelForm.style.display = '';
})

button.addEventListener('click', function() {
    var checkedLevel = document.querySelector('input[name=levels]:checked').value;
    levelForm.style.display = 'none';
    var lev = new Level(words, Number(checkedLevel));
    lev.createEventListeners();
})

function Level(levels, levelNumber) {
    this.levelNumber = levelNumber;
    var levelWords = levels[levelNumber];
    var randomIndex = Math.floor(Math.random() * levelWords.length);
    this.charArray = [].slice.call(levelWords[randomIndex]);
    this.charShuffledArray = this.charArray.slice();
    while (comparePermutatedArrays(this.charShuffledArray, this.charArray)) {
        shuffle(this.charShuffledArray);
    };

    this.status = null;

    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.container.id='container';
    this.charShuffledArray.map(function(char){
        var divChar = document.createElement('div');
        divChar.draggable = 'true';
        divChar.className = 'char';
        divChar.textContent = char;
        this.container.appendChild(divChar);
    });
}

Level.prototype.createEventListeners = function() {
    var divChars = document.querySelectorAll(".char");
    var dragSrcEl = null;
    var result = [];
    var level = this;
    [].forEach.call(divChars, function(divChar){
        divChar.addEventListener('dragstart', dragstartHandler);
        divChar.addEventListener('dragover', dragoverHandler);
        divChar.addEventListener('dragenter', dragenterHandler);
        divChar.addEventListener('dragleave', dragleaveHandler);
        divChar.addEventListener('drop', dropHandler);
        divChar.addEventListener('dragend', function(e) {
            dragendHandler(e, level, result);
        }, false);
    })
};

Level.prototype.clear = function() {
    this.container.parentNode.removeChild(this.container);
}

function comparePermutatedArrays(array1, array2) {
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i])
            return false;
    }
    return true;
}

function shuffle(array) {
    var n = array.length, i, temp;
    while (n) {
        i = Math.floor(Math.random() * n--);
        temp = array[n];
        array[n] = array[i];
        array[i] = temp;
    };
    return array;
}

function dragstartHandler(e) {
    var divChars = document.querySelectorAll(".char");
    [].forEach.call(divChars, function(divChar){
        divChar.classList.add('dragging');
    })

    dragSrcEl = e.target;
    dragSrcEl.classList.remove('dragging');

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    e.target.style.visibility = "hidden";
}

function dragoverHandler(e) {
    if (e.preventDefault)
        e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function dragenterHandler(e) {
    this.classList.add('over');

}

function dragleaveHandler(e) {
    this.classList.remove('over');
}

function dropHandler(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    if (dragSrcEl != this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
}

function dragendHandler(e, level, result){
    dragSrcEl = null;
    result.length = 0;
    e.target.style.visibility = "visible";
    var divChars = document.querySelectorAll(".char");
    [].forEach.call(divChars, function(divChar){
        divChar.classList.remove('dragging', 'over');
        result.push(divChar.textContent);
    })
    if (comparePermutatedArrays(result, level.charArray)) {
        console.log("You win!");
        setTimeout(function() {
            level.clear();
            levelForm.style.display = '';
        }, 2000);
    };
}
