var window, setTimeout, document;
window.onload = function () {
    
    'use strict';
    var canvas,
        snakee,                                       // declaration de notre serpent de classe serpent
        applee,
        canvasWidth = 900,                            // valeur de canvas.width 600pixel
        canvasHeight = 600,                           // valeur de canvas.height 900pixel
        ctx,                                          // variable ctx 
        delay = 100,                                // variable delay, timer avant le nouveau mouvement
        timeout,
        blockSize = 30,                               // taille des blocks
        widthInBlocks = canvasWidth / blockSize,
        heightInBlocks = canvasHeight / blockSize,
        score;
    
    function drawBlock(ctx, position) {                 // fonction de dessin qui prend comme attribut le pinceau et les postions de dessin
        var x = position[0] * blockSize,             // position x en pixel converti en postion x du bloc
            y = position[1] * blockSize;              // position y en pixel converti en postion x du bloc
        ctx.fillRect(x, y, blockSize, blockSize);        // ctx cree un rectangle rempli de longueur et largeur blockSize de poaition x et y 
    }
    
    function Apple(position) {
        this.position = position;
        this.draw = function () {
            ctx.save();
            ctx.fillStyle = "green";
            ctx.beginPath();
            var radius = blockSize / 2,
                x = this.position[0] * blockSize + radius,
                y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function () {
            var newX = Math.round(Math.random() * (widthInBlocks - 1)),
                newY = Math.round(Math.random() * (heightInBlocks  - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function (snakeToCheck) {
            var i,
                isOnSnake = false;
            for (i = 0; i < snakeToCheck.body.length; i += 1) {
                if (this.position[0] === snakeToCheck.body[i][0] && (this.position[1] === snakeToCheck.body[i][1])) {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }
    
    function Snake(body, direction) {                   // definition de la classe serpent qui prend body et direction comme parametre
        this.body = body;                            // body sera defini par la valeur body donnee dans la declaration de l'instance
        this.direction = direction;                  // direction donnee au serpent
        this.ateApple = false;
        this.draw = function () {                       // fonction qui dessine le serpent
            var i;
            ctx.save();                               // sauvegarde les positions x et y actuelles du pinceau avant de commencer
            ctx.fillStyle = "#f00";                  // choisi la couleur rouge 
            for (i = 0; i < this.body.length; i += 1) { // pour chaque block dans body jusau'au dernier block... fait le truc suivant:
                drawBlock(ctx, this.body[i]);          // utilise la fonction drawBlock, i etant la paire de position pour chaque block
            }
            ctx.restore();                            // restaure ctx avec les positions apres avoir tout fait
        };
        this.advance = function () {                   // fait avancer en choisissant les nouvelles positions de dessin
            var nextposition = this.body[0].slice(); // nextposition copie les parametres du 1er element de body (le bloc tete) du serpent
            switch (this.direction) {
            case "right":
                nextposition[0] += 1;        // prend l'axe x ([0]) de la paire position x&y et ajoute 1, donc pas vers la droite
                break;
            case "left":
                nextposition[0] -= 1;        // prend l'axe x ([0]) de la paire position x&y et enleve 1, donc pas vers la gauche
                break;
            case "down":
                nextposition[1] += 1;        // prend l'axe y ([1]) de la paire position x&y et ajoute 1, donc pas vers le bas
                break;
            case "up":
                nextposition[1] -= 1;        // prend l'axe y ([1]) de la paire position x&y et ajoute 1, donc pas vers le haut
                break;
            default:
                throw ("Invalid direction");
            }
            this.body.unshift(nextposition);         // creer une nouvelle paire position avec la valeur x+1 contenu dans next position
            if (!this.ateApple) {
                this.body.pop();                    // efface la derniere paire (la queue)
            } else {
                this.ateApple = false;
            }
        };                                           // en gros, cette fonction cree un nouveau bloc tete x+1 et efface le block queue
        this.setDirection = function (newDirection) {
            var allowedDirections;
            switch (this.direction) {
            case "right":
            case "left":
                allowedDirections = ["up", "down"];
                break;
            case "down":
            case "up":
                allowedDirections = ["left", "right"];
                break;
            default:
                throw ("Invalid direction");
            }
            if (allowedDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };
        this.checkCollision = function () {
            var i,
                wallCollision = false,
                snakeCollision = false,
                head = this.body[0],
                rest = this.body.slice(1),
                snakeX = head[0],
                snakeY = head[1],
                minX = 0,
                minY = 0,
                maxX = widthInBlocks - 1,
                maxY = heightInBlocks - 1,
                ifNotBetweenHorizontalWalls  = snakeX < minX || snakeX > maxX,
                ifNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
            if (ifNotBetweenHorizontalWalls || ifNotBetweenVerticalWalls) {
                wallCollision = true;
            }
             
            for (i = 0; i < rest.length; i += 1) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };
        this.IsEatingApple = function (appleToEat) {
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
                return true;
            } else {
                return false;
            }
        };
         
    }
    
    function gameOver() {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.strokeText("Game Over", (canvasWidth / 2),   (canvasHeight / 2) - 180);
        ctx.fillText("Game Over", (canvasWidth / 2),   (canvasHeight / 2) - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", (canvasWidth / 2),   (canvasHeight / 2) - 120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", (canvasWidth / 2),   (canvasHeight / 2) - 120);
        ctx.restore();
    }
    
    function drawScore() {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(score.toString(), (canvasWidth / 2), (canvasHeight / 2));
        ctx.restore();
    }
                                                          
    function refreshCanvas() {                         // fonction de mouvement
        snakee.advance();                                 // appel de la fonction qui les nouvelles positions de dessin des blocs
        if (snakee.checkCollision()) {
            gameOver();
        } else {
            if (snakee.IsEatingApple(applee)) {
                snakee.ateApple = true;
                score += 1;
                do {
                    applee.setNewPosition();
                } while (applee.isOnSnake(snakee));
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);      // effacer tout le contenu (largeur et longueur) de canvas (clearRect= gomme stv) 
            drawScore();
            snakee.draw();                                    // appel de la fonction qui dessine les blocs
            applee.draw();
            timeout = setTimeout(refreshCanvas, delay);                 // Attend le delai "delay" et reexecute refreshCanva  
        }
    }
    
    function init() {                                  // fonction de demarrage
        canvas = document.createElement('canvas');    // canvas = un nouvel element cree dans le html (rectangle qui contient le jeu)
        canvas.width = canvasWidth;                       // Donner a canvas une largeur CanvasWidth
        canvas.height = canvasHeight;                     // Donner a canvas une longueur CanvasHeigth
        canvas.style.border = "30px solid gray";         // Appliquer un style de bordure a canvas
        canvas.style.display = "block";
        canvas.style.margin = "50px auto";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);                // placer canvas dans le <body> (<body><canvas><canvas/></body>)
        ctx = canvas.getContext('2d');                    // ctx prend ses position en fonction de canvas, il utilise le contexte de canvas
        snakee = new Snake([[5, 5 ], [4, 5 ], [3, 5]], "right");  // snake [[position x,y(du premier block)],[x,y(du second block)],[etc...]] et la direction de depart
        applee = new Apple([6, 5 ]);
        score = -1;
        refreshCanvas();                                  // Appelle du prochain mouvement (rafraichissement)
    }
        
    function restart() {
        snakee = new Snake([[5, 5 ], [4, 5 ], [3, 5 ] ], "right");  // snake [[position x,y(du premier block)],[x,y(du second block)],[etc...]] et la direction de depart
        applee = new Apple([10, 10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();                                  // Appelle du prochain mouvement (rafraichissement)
    }
         
    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode,
            newDirection;
        switch (key) {
        case 37:
            newDirection = "left";
            break;
        case 38:
            newDirection = "up";
            break;
        case 39:
            newDirection = "right";
            break;
        case 40:
            newDirection = "down";
            break;
        case 32:
            restart();
            return;
        default:
            return; // si aucun des cas en haut, alors ne fait rien 
        }
        snakee.setDirection(newDirection);
    };

    init();                                           // lance la fontion de demarrage, DEMARRE LE PROGRAMME
};