var Stage;
var Renderer;

var Width = 634;
var Height = 555;

var Init_Game;
var Loader;

var BG1;
var BG2;

var Player1 = new PlayerStruct("Fighter_jet.png",400,400,0.5, 0.5,"bullet1.png");
var Enemy1 = new EnemyStruct("Enemy1.png",100,200,0.5, 0.5,"bullet1.png");

var playerBullets = new Array();
var enemyBullets = new Array();



window.onload = Initialization();

//----------------Initializing Game Variables-------------
function Initialization (Init_Game)
{
	Stage_Init();
	BG_Init();
	Stage.addChild(Player1.Player);
	Stage.addChild(Enemy1.Enemy);
	
}


//-------------Initializing Canvas---------------
function Stage_Init ()
{
	Stage = new PIXI.Stage(0x000000);
	Renderer = PIXI.autoDetectRenderer(Width,Height);
	document.body.appendChild(Renderer.view);
}


//-------------Initializing BackGround-----------
function BG_Init ()
{
	var Stars1 = PIXI.Texture.fromImage("star1.png");
	var Stars2 = PIXI.Texture.fromImage("star2.png");
	BGI1 = new PIXI.Sprite(Stars1);
	BGI2 = new PIXI.Sprite(Stars2);
	BGI1.position.x = 0;
	BGI1.position.y = 0;
	BGI2.position.x = 0;
	BGI2.position.y = -1*Renderer.height;
	Stage.addChild(BGI1);
	Stage.addChild(BGI2);
	
}

//-------------Initializing Characters------------
function EnemyStruct(Texture_Path, posX, posY, anX, anY, Bullet_Type)
{
 //Enemy main Components
	this.Enemy_texture = PIXI.Texture.fromImage(Texture_Path);
	this.Enemy = new PIXI.Sprite(this.Enemy_texture);
	this.Espeed = 5;
	this.shootDelay = Math.random() * (500 - 200) + 100;

	this.Enemy.anchor.x = anX;
	this.Enemy.anchor.y = anY;
	this.Enemy.position.x = posX;
	this.Enemy.position.y = posY;	

 //Enemy Bullet Components
	this.Ebullet = new BulletStruct (this.Enemy, 0.5, 0.5, Bullet_Type );
	

	
}

function Item(){
		this.id = Math.random() * (itemTextures.length - 1);
		this.item = new PIXI.Sprite(itemTextures[this.id]);
}

function PlayerStruct (Texture_Path,posX,posY,anX,anY)
{
	//Player main Components
	this.Player_texture = PIXI.Texture.fromImage(Texture_Path);
	this.Player = new PIXI.Sprite(this.Player_texture);
	this.playerItem = -1;
	this.bulletType = "bulletJet";
	this.money = 0;
	
	this.Player.anchor.x = anX;
	this.Player.anchor.y = anY;
	this.Player.position.x = posX;
	this.Player.position.y = posY;
	
	//-------------------------------------------------------
	this.bullet = function bulletFire(){
		var bullet = new BulletStruct(this.player, .5, .5, );
		bullet.InitForPlayer();
		shootSound.play();
	}
	//-------------------------------------------------------
	this.laser = function laserFire(){
		//sarcasticMessageHolder.innerHTML = "lol, no laser dude, what do you think this is, CI?!\n" +  
		//"Reverting back to bullets and shit.";
		this.playerItem = -1;
	}
	//-------------------------------------------------------
	this.Fire = function playerFire(){
		switch(this.playerItem){
			case -1:
				this.bullet();
				break;
			case 0:
				this.laser();
				break;
		}
	}
}

function BulletStruct (Shooter, anchorX, anchorY, Bullet_Type )
{
//Bullet Main Varaibles
	this.Bullet_Tex = PIXI.Texture.fromImage(Bullet_Type);
	this.Bullet = new PIXI.Sprite(this.Bullet_Tex);
	this.Btype = Bullet_Type;
	this.Bspeed = 10;

//Bullet Functions	
	this.InitForEnemy = function InitPosForEnemy ()
	{
		this.Bullet.anchor.x = anchorX;
		this.Bullet.anchor.y = anchorY;
		this.Bullet.position.x = this.Shooter.position.x;
		this.Bullet.position.y = this.Shooter.position.y + this.Shooter.height*0.5;
		stage.addChild(this.Bullet);
		enemyBullets.push(this.Bullet);
	}
	
	this.InitForPlayer = function InitPosForPlayer ()
	{
		this.Bullet.anchor.x = anchorX;
		this.Bullet.anchor.y = anchorY;
		this.Bullet.position.x = this.Shooter.position.x;
		this.Bullet.position.y = this.Shooter.position.y - this.Shooter.height*0.5;
		stage.addChild(this.Bullet);
		playerBullets.push(this.Bullet);
	}
	
	this.ChangeWeapon = function ChangeBullet ()
	{
		this.Bullet_Tex = PIXI.Texture.fromImage(this.Btype);
		this.Bullet = new PIXI.Sprite(this.Bullet_Tex);
	}
	
	this.PBupdate = function updateplayerBullets ()
	{
		for(var i=0; i<playerBullets.length;i++){
		//alert(i);
			playerBullets[i].position.y -= Bspeed;
			//Check for collision
			if(checkCollision(playerBullets[i],enemy)){
				Stage.removeChild(playerBullets[i]);
				Stage.removeChild(enemy);
				playerBullets.splice(i,1);
			}
			//Check for out of bounds
			if(!between(playerBullets[i].position.x,590,0)){
				Stage.removeChild(playerBullets[i]);
				playerBullets.splice(i,1);
			}
		}
	}
	
	this.EBupdate = function updateEnemyBullets(){
		for(var i=0; i<enemyBullets.length;i++){
		//alert(i);
			enemyBullets[i].position.y += Bspeed;
			//Check for collision
			if(checkCollision(enemyBullets[i],jet)){
				Stage.removeChild(enemyBullets[i]);
				Stage.removeChild(jet);
				enemyBullets.splice(i,1);
			}
			//Check for out of bounds
			if(!between(enemyBullets[i].position.x,590,0)){
				Stage.removeChild(enemyBullets[i]);
				enemyBullets.splice(i,1);
			}
		}
	}
}


//---------Collision Detection------------
function checkCollision(objectA,objectB){
		//Sides of objectA:
		var rightA = objectA.position.x + 0.5*objectA.width;
		var leftA  = objectA.position.x - 0.5*objectA.width;
		var topA   = objectA.position.y - 0.5*objectA.height;
		var bottomA = objectA.position.y + 0.5*objectA.height;
		//Sides of objectB:
		var rightB = objectB.position.x + 0.5*objectB.width;
		var leftB  = objectB.position.x - 0.5*objectB.width;
		var topB   = objectB.position.y - 0.5*objectB.height;
		var bottomB = objectB.position.y + 0.5*objectB.height;
		
		//Basic idea: check if a side in one object is between two sides in the other object.
		if(((between(rightA,rightB,leftB) || between(leftA,rightB,leftB)) &&
			(between(topA,topB,bottomB) || between(bottomA,topB,bottomB)))||
			((between(rightB,rightA,leftA) || between(leftB,rightA,leftA)) &&
			(between(topB,topA,bottomA) || between(bottomB,topA,bottomA))))
				return true;
		else
			return false;
	}

function between(a,b,c){
		return ((a>=b && a<=c) || (a<=b && a>=c)) ? true : false;
	}


//Player Movement Controls
var intervalId;
window.addEventListener('mousemove', function(event) {
	if(alive){
	var rect = renderer.view.getBoundingClientRect();
	Player1.player.position.y = event.screenY;
	Player1.player.position.x = event.screenX - rect.left;
}
},true);

window.addEventListener('mousedown', function(event) {
	if(alive && event.button == 0){
		intervalId = setInterval(Player1.Fire, 100);
	}
},false);
window.addEventListener('mouseup', function(event) {
	clearInterval(intervalId);
}, false);

//-----------------Update Loop-----------
function GameUpdate ()
{
	//Move BackGround
	
	BGI1.position.y += 10;
	BGI2.position.y += 10;
	if ( BGI1.position.y > Renderer.height )
		{
			BGI1.position.y = (Renderer.height*-1)+10;
		}
	if ( BGI2.position.y > Renderer.height )
		{
			BGI2.position.y = (Renderer.height*-1)+10;
		}
	
	//Update Bullets
	if(playerBullets.length > 0) Player1.Pbullet.PBupdate;
	if(enemyBullets.length > 0) Enemy1.Ebullet.EBupdate;

	//Check Collision
	if(checkCollision(Player1.Player,Enemy1.Enemy))
	{
		Stage.removeChild(Player1.Player);
		Stage.removeChild(Enemy1.Enemy);
	}
}	

	
//-----------------Game Loop-----------
requestAnimFrame (GameLoop);
function GameLoop ()
{
	
    GameUpdate();
	Renderer.render(Stage);
	requestAnimFrame (GameLoop);
}

//--------------Artificial Intel-----------
/*	function enemyPattern1 (Enemy)
	{
		 if ( Emov_right )
		 {
			Enemy.position.x += Espeed_x;
			window.setTimeout("Enemy_Left ()",  1000);
		 }
		 else if ( Emov_left )
		 {
			Enemy.position.x -= Espeed_x;
			window.setTimeout("Enemy_Right ()", 1000);
		 }
		Enemy.position.y += Espeed_y;
		//alert("7adrab Fil Malian!!");
		window.setTimeout("enemyFire(enemy)", 1000);
	}

	function enemyRight()
	{
		Emov_right = true;
		Emov_left = false;
	}
	
	function enemyLeft()
	{
		Emov_right = false;
		Emov_left = true;
	}*/