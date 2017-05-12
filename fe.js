function encapsulation() {

	var battleHit;
	var battleDamage;
	var unitClass;
	var holder;
	var holder2;
	var oldUnit;
	var unit1;
	var unit2;
	var weapon1;
	var weapon2;
	var orphanWeapon;
	var missMsg = "<br><span class=\"miss\">Miss!</div>";
	var noDmg = "<br><span class=\"miss\">No damage!</div>";
	var miss = false;
	var miss2 = false;
	var noDmg1 = false;
	var noDmg2 = false;
	var inventory = [];



		function getUnitsWithRandomNames(n) {

			if(n) {
				$.getJSON("https://randomuser.me/api/?inc=name", function(data) {
					holder = data.results[0].name.first;

					continuous(n, holder);

				});
			}

			else {
				$.getJSON("https://randomuser.me/api/?inc=name", function(data) {
					holder = data.results[0].name.first;

					//if your unit was manually named, insert continuous(name, name) call; else, generate second random name

					$.getJSON("https://randomuser.me/api/?inc=name", function(data) {
						holder2 = data.results[0].name.first;

						continuous(holder, holder2);

					});

				});
			}
		}

		function getRandomInRange(min, max) {
			return Math.floor(Math.random()*(max-min+1)+min);
		}

		function getRandomUnitClass() {
			var x = getRandomInRange(0,1);
			if(x == 1) {
				unitClass = "cavalier";
				return unitClass;
			}
			else {
				unitClass = "mage";
				return unitClass;
			}
		}

		//unit constructor
		function unit(unitName, unitClass, str, mag, hp, def, res, hit) {
			this.unitName = unitName;
			this.unitClass = unitClass;
			this.str = str;
			this.hp = hp;
			this.hit = hit;
			this.def = def;
			this.mag = mag;
			this.res = res;
			this.origHp = hp;
		}

		//create units by class with semirandom stats and random names
		function unit(unitClass, n, lvl, exp) {

			if(n) {
				this.unitName = n.replace(n[0], n[0].toUpperCase());
			}
			else {
				this.unitName = unitClass.replace(unitClass[0], unitClass[0].toUpperCase());
			}

			this.bag = [];
			this.bagMaxLength = 5;

			if(unitClass == "cavalier") {
				this.str = getRandomInRange(6,10) + lvl;
				this.hp = getRandomInRange(10,15) + lvl;
				this.hit = getRandomInRange(5,9);
				this.def = getRandomInRange(5,10) + lvl;
				this.mag = getRandomInRange(3,6) + lvl;
				this.res = getRandomInRange(3,6) + lvl;
				this.unitClass = unitClass;
				this.portrait = "images/cav_portrait.png";
			}
			if(unitClass == "mage") {
				this.str = getRandomInRange(3,7) + lvl;
				this.hp = getRandomInRange(8,12) + lvl;
				this.hit = getRandomInRange(4,9);
				this.def = getRandomInRange(2,6) + lvl;
				this.mag = getRandomInRange(5,9) + lvl;
				this.res = getRandomInRange(5,9) + lvl;
				this.unitClass = unitClass;
				this.portrait = "images/mage_portrait.png";
			}

			this.origHp = this.hp;
			this.lvl = lvl;
			if(exp) {
				this.currentExp = exp;
			}
			else {
				this.currentExp = 0;
			}
			this.neededExp = (this.lvl * 10)*2;

			console.log(this.unitName + " Exp: " + this.currentExp + " Lvl: " + this.lvl + " Needed exp: " + this.neededExp);
		}

		//weapon constructor
		function weapon(mt, hit, cat, name, desc, uses) {
			this.mt = mt;
			this.hit = hit;
			this.name = name;
			this.cat = cat;
			this.uses = uses;
			if(desc) {
				this.desc = desc;
			}
			else {
				this.desc = name + " with " + mt + " mt and " + hit + " hit. " + uses + " uses.";
			}
		}

		//item constructor
		function item(name) {
			if(name == "Vulnerary") {
				this.name = name;
				this.healAmt = 10;
				this.desc = "Heal 10 points."
			}
		}

		function useItem(item, unit) {
			unit.hp += item.healAmt;
			if (unit.hp > unit.origHp) {
				unit.hp = unit.origHp;
			}
			updateDisplay(unit1, unit2);
		}

		function addToBag(unit, x) {
			if(unit.bag.length < unit.bagMaxLength) {
				unit.bag.push(x);
				console.log(unit.bag);
				console.log(unit.bag.length);
			}
		}

		//update exp bars
		function updateExpBar(unit) {
			var expPercentage = (unit.currentExp / unit.neededExp)*100;
			var expPercentageStr = expPercentage.toString().concat("%");

			$(".expBar").css("width", expPercentageStr);
		}

		//update health bars
		function updateHealthBar(unit) {

			var healthPercentage = (unit.hp / unit.origHp)*100;
			var healthPercentageStr = healthPercentage.toString().concat("%");

			if(unit == unit1) {
				$("#hpBar1").css("width", healthPercentageStr);
				if(healthPercentage < 75) {
					$("#hpBar1").css("background-color", "#ffc73a");
				}
				if(healthPercentage < 25) {
					$("#hpBar1").css("background-color", "#f94a4a");
				}
			}

			if(unit == unit2) {
				$("#hpBar2").css("width", healthPercentageStr);

				if(healthPercentage < 75) {
					$("#hpBar2").css("background-color", "#ffc73a");
				}
				if(healthPercentage < 25) {
					$("#hpBar2").css("background-color", "#f94a4a");
				}
			}

		}

		//update display function
		function updateDisplay(a, b) {

			if(a.hp > 0) {
				$("#unit1_info").html("<h3>" + a.unitName + " - " + a.unitClass +
				"</h3><div class='col-md-6'id='unitPortrait'><p><img src='" + a.portrait +
				"'></p></div><div class='col-md-6' id='unitStats'><h4>Lvl: " + a.lvl +
				"</h4><p><div class='hpBarContainer'><div class='hpBar' id='hpBar1'>&nbsp;</div><div class='hpText'>HP: " + a.hp + " / " + a.origHp +
				"</div></div><div class='hpBarContainer'><div class='expBar'>&nbsp</div><div class='hpText' id='expText'>EXP: " + a.currentExp +
				" / " + a.neededExp +
				"</div></div><br><span id='str'>Str: " + a.str +
				"</span><br>" + "Def: " + a.def +
				"<br><span id='mag'>Mag: " + a.mag +
				"</span><br><span id='res'>Res: " + a.res +
				"</span><br><span id='hit'>Hit: " + a.hit + "</span></div>");

				updateHealthBar(a);
				updateExpBar(a);
			}

			if(b.hp > 0) {
				$("#unit2_info").html("<h3>" + b.unitName + " - " + b.unitClass +
				"</h3><h4>Lvl: " + b.lvl +
				"</h4><p><div class='hpBarContainer'><div class='hpBar'id='hpBar2'>&nbsp;</div><div class='hpText'>HP: " + b.hp + " / " + b.origHp +
				"</div></div><br>Str: " + b.str +
				"<br>Def: " + b.def +
				"<br>Mag: " + b.mag +
				"<br>Res: " + b.res +
				"<br>Hit: " + b.hit);

				updateHealthBar(b);

			}

			if(a.hp <= 0 || b.hp <= 0) {
				$("#attack").parent("button").addClass("disabled");
			}

			//update player stats with stat boosts from weapon
			if(a.hasOwnProperty("weapon")) {
				$("#unitStats").append("<p>" + a.weapon.name + " equipped. " + a.weapon.uses + " uses left.</p>");
				$("#hit").append(" -> <span id='battleHit'>" + battleHit + "</span>");

				if(a.weapon.cat == "phys") {
					$("#str").append(" -> <span id='battleStr'>" + battleDamage + "</span>");
				}
				else if(a.weapon.cat == "mag") {
					$("#mag").append(" -> <span id='battleStr'>" + battleDamage + "</span>");
				}
			}

			if(battleHit < a.hit) {
				$("#battleHit").css("color", "red");
			}
			else if(battleHit > a.hit) {
				$("#battleHit").css("color", "#44cc1c");
			}

			if(battleDamage < a.str) {
				$("#battleStr").css("color", "red");
			}
			else if(battleDamage > a.str) {
				$("#battleStr").css("color", "#44cc1c");
			}

			updateWeaponInfo();

			setTimeout(function() {
				if($("#unit1_info").hasClass("shake")) {
					$("#unit1_info").removeClass("shake");
				}
				if($("#unit2_info").hasClass("shake")) {
					$("#unit2_info").removeClass("shake");
				}
				if($("#unit1_info").children(".miss").length > 0) {
					$("#unit1_info").remove(".miss");
				}
				if($("#unit2_info").children(".miss").length > 0) {
					$("#unit2_info").remove(".miss");
				}

			}, 500)


		}

		function equipWeapon(w) {
			unit1.weapon = w;
			battleHit = (unit1.hit*w.hit)/10;

			if(w.cat == "phys") {
				battleDamage = unit1.str+w.mt;
			}

			else if(w.cat == "mag") {
				battleDamage = unit1.mag+w.mt;
			}

			updateDisplay(unit1, unit2);
		}

		function unequipWeapon() {
			delete unit1.weapon;
			battleHit = unit1.hit;
			battleDamage = unit1.str;
			updateDisplay(unit1, unit2);
		}

		//attack function; update html with stats
		function attack(a, b) {
			var randomNum = Math.random()*10;

			if(a.hasOwnProperty("weapon")) {
				if(randomNum <= battleHit) {
					//make sure damage is more than 0
					//(don't add negative damage to opponent hp)
					if(a.weapon.cat == "phys") {
						if(battleDamage-b.def > 0) {
							b.hp -= battleDamage-b.def;
							$("#unit2_info").addClass("shake");
							console.log("Unit 1: Hit landed");
						}
						else {
							noDmg1 = true;
							console.log("Unit 1: No damage dealt");
						}
					}

					else if(a.weapon.cat == "mag") {
						if(battleDamage-b.res > 0) {
							b.hp -= battleDamage-b.res;
							$("#unit2_info").addClass("shake");
							console.log("Unit 1: Hit landed");
						}
						else {
							noDmg1 = true;
							console.log("Unit 1: No damage dealt");
						}
					}

				a.weapon.uses--;
			}
				else {
					miss = true;
					console.log("Unit 1: Miss");
				}
				console.log("Battle hit rate: " + battleHit + "; Battle damage: " + battleDamage);
			}

			if(a.hasOwnProperty("weapon") === false) {

				if(randomNum <= a.hit) {
					if(a.str-b.def > 0) {
						b.hp -= a.str-b.def;
						$("#unit2_info").addClass("shake");
						console.log("Unit 1: Hit landed");
					}
					else {
						b.hp = b.hp;
						noDmg1 = true;
						console.log("Unit 1: No damage dealt");
					}
				}
				else {
					miss = true;
					console.log("Unit 1: Miss");
				}
			}

			//update hp display
			updateDisplay(a, b);

			endTurn(a, b);
		}

		//ai attack function
		function aiAttack(b, a) {
			var randomNum = Math.random()*10;
			if(b.hit >= randomNum) {
				if(b.str-a.def > 0) {
						a.hp -= b.str-a.def;
					$("#unit1_info").addClass("shake");
					console.log("Unit 2: Hit landed");
				}
				else {
					a.hp = a.hp;
					noDmg2 = true;
					console.log("Unit 2: No damage dealt");
				}
			}
			else {
				miss2 = true;
				console.log("Unit 2: Missed");
			}

			//update hp display
			updateDisplay(a, b);

			endAiTurn(b, a);
		}

		//end the ai turn
		function endAiTurn(a, b) {

			if(miss2 === true) {
				$("#unitStats").append(missMsg);
				miss2 = false;
			}

			if(noDmg2 === true) {
				$("#unitStats").append(noDmg);
				noDmg2 = false;
			}

			if (b.hp <= 0) {
				$("#unit1_info").html("<h3>Unit 1 has been defeated</h3>");
				$("#unit1_info").addClass("defeated");
				$("#attack").addClass("disabled");
			}
		}

		//end turn function
		function endTurn(a, b) {

			if (b.hp <= 0) {
				enemyDefeated();
			}
			else {
				setTimeout(function() { aiAttack(b, a); }, 1500);
			}

			if(a.hasOwnProperty("weapon")) {
				if(a.weapon.uses == 0) {
					delete a.weapon;
				}
			}

		}

		function lvlupMsg() {
			$(".levelUp").css("display", "visible");
		}

		function lvlUp(unit) {
			if(unit.currentExp >= unit.neededExp) {
				unit.currentExp = unit.currentExp - unit.neededExp;
				unit.lvl++;
				unit.neededExp = (unit.lvl*10)*2;
				$(".battleground").append("<div class='levelUp fadeInUp'><h3>Level up!</h3></div>");

				if(unit.unitClass == "cavalier") {
					//rng for hp
					if(Math.random()*100 >= 75) {
						unit.origHp++;
						console.log("HP increased by 1.");
						$(".levelUp").append("<p class='statIncrease'>HP increased by 1.</p>")
					}

					//rng for str
					if(Math.random()*100 >= 35) {
						unit.str++;
						console.log("Str increased by 1.");
						$(".levelUp").append("<p class='statIncrease'>Str increased by 1.</p>")
					}

					//rng for def
					if(Math.random()*100 >= 15) {
						unit.def++;
						console.log("Def increased by 1.");
						$(".levelUp").append("<p class='statIncrease'>Def increased by 1.</p>")
					}

					//rng for res
					if(Math.random()*100 >= 12) {
						unit.res++;
						console.log("Res increased by 1.");
						$(".levelUp").append("<p class='statIncrease'>Res increased by 1.</p>")
					}

					//rng for mag
					if(Math.random()*100 >= 35) {
						unit.mag++;
						console.log("Mag increased by 1.");
						$(".levelUp").append("<p class='statIncrease'>Mag increased by 1.</p>")
					}
				}
				if(unit.unitClass == "mage") {
					//rng for hp
					if(Math.random()*100 >= 55) {
						unit.origHp++;
						console.log("HP increased by 1.");
						$(".levelUp").append("<p class='statIncrease'>HP increased by 1.</p>")
					}

					//rng for str
					if(Math.random()*100 >= 55) {
						unit.str++;
						console.log("Str increased by 1.");
						$(".levelUp").append("<p class='statIncrease'>Str increased by 1.</p>")
					}

					//rng for def
					if(Math.random()*100 >= 5) {
						unit.def++;
						console.log("Def increased by 1.");
						$(".levelUp").append("<p class='statIncrease'>Def increased by 1.</p>")
					}

					//rng for res
					if(Math.random()*100 >= 35) {
						unit.res++;
						console.log("Res increased by 1.");
						$(".levelUp").append("<p class='statIncrease'>Res increased by 1.</p>")
					}

					//rng for mag
					if(Math.random()*100 >= 55) {
						unit.mag++;
						console.log("Mag increased by 1.");
						$(".levelUp").append("<p class='statIncrease'>Mag increased by 1.</p>")
					}
				}
				$(".levelUp").append("<button class='btn btn-primary' id='lvlOk'>OK</button>");
				$("#lvlOk").on("click", function() {
					$(".levelUp").remove();
				});
				lvlupMsg();
				console.log("unit 1 lvl: " + unit.lvl + " needed exp: " + unit.neededExp);
			}
			updateDisplay(unit1, unit2);
		}

		function enemyDefeated() {
			unit1.currentExp += unit2.currentExp;
			lvlUp(unit1);

			$("#unit2_info").html("<h3>Unit 2 has been defeated</h3>");
			$("#unit2_info").addClass("defeated");

			$("#unit2_info").append("<button class='btn btn-primary' id='genEnemy'>Get new opponent</button>")

			$("#genEnemy").on("click", function() {
				resetUnit();
			});

			$("#attack").addClass("disabled");
		}

		//generate a new enemy
		function resetUnit() {
			unit2 = new unit(getRandomUnitClass(),null,unit1.lvl, getRandomInRange(unit1.lvl, (unit1.lvl*10)));
			updateDisplay(unit1, unit2);
			$("#unit2_info").removeClass("defeated");
			$("#attack").removeClass("disabled");
		}

		function addButtons() {
			//attack button

			$(".buttonHolder").html("<button class='btn btn-primary' id='attack'>attack</button>");

			$("#attack").on("click", function() {
				if(unit2.hp > 0) {
					attack(unit1, unit2);
					if(miss === true) {
						$("#unit2_info").append(missMsg);
						miss = false;
					}

					if(noDmg1 === true) {
						$("#unit2_info").append(noDmg);
						noDmg1 = false;
					}
				}
			});

			//equip weapon button
			$("#equip").on("click", function() {
				orphanWeapon = weapon1;
				equipWeapon(orphanWeapon);
			});

			$("#unequip").on("click", function() {
				unequipWeapon();
			});

			//get new button 1
			$("#getNewAxe").on("click", function() {
				getNewWeapon("Axe");
			});

			$("#addaxetobag").on("click", function() {
				addToBag(unit1, weapon1);
			});

			//equip weapon button
			$("#equip2").on("click", function() {
				orphanWeapon = weapon2;
				equipWeapon(orphanWeapon);
			});

			$("#unequip2").on("click", function() {
				unequipWeapon();
			});

			//get new button 2
			$("#getNewBook").on("click", function() {
				getNewWeapon("Book");
			});

			//use item button
			$("#useitem").on("click", function() {
				useItem(item1, unit1);
			});

		}

		function getNewWeapon(name) {
			if(name == "Axe") {
				console.log("new axe generated");
				weapon1 = new weapon(getRandomInRange(4,10), getRandomInRange(4,10), "phys", "Axe", null, getRandomInRange(5,15));
			}

			if(name == "Book") {
				console.log("new book generated");
				weapon2 = new weapon(getRandomInRange(4,9), getRandomInRange(4,10), "mag", "Book", null, getRandomInRange(4,12));
				console.log("orphan weapon: " + orphanWeapon + "unit1 weapon: " + unit1.weapon + "weapon2: " + weapon2);
			}
			updateDisplay(unit1, unit2);
		}

		function updateWeaponInfo() {
			//display weapon info
			$("#weapons_info").html("<div class='col-md-4'><h3>" + weapon1.name + "</h3><p>" + weapon1.desc + "</p><p><button class='btn btn-primary' id='equip'>equip</button> <button class='btn btn-primary' id='unequip'>unequip</button> <button class='btn btn-primary' id='getNewAxe'>get new</button></p><p><button class='btn btn-primary' id='addaxetobag'>add to bag</button></p>");
			$("#weapons_info").append("<div class='col-md-4'><h3>" + weapon2.name + "</h3><p>" + weapon2.desc + "</p><p><button class='btn btn-primary' id='equip2'>equip</button> <button class='btn btn-primary' id='unequip2'>unequip</button> <button class='btn btn-primary' id='getNewBook'>get new</button></p></div></div>");
			$("#weapons_info").append("<div class='col-md-4'><h3>" + item1.name + "</h3><p>" + item1.desc + "</p><p><button class='btn btn-primary' id='useitem'>use</button></p></div>");

			addButtons();

		}

		function continuous(d, g) {

			//create units
			unit1 = new unit(getRandomUnitClass(), d, 1);
			unit2 = new unit(getRandomUnitClass(), g, 1, getRandomInRange(unit1.lvl+1, (unit1.lvl*10)));

			//create weapons
			weapon1 = new weapon(getRandomInRange(4,10), getRandomInRange(4,10), "phys", "Axe", null, getRandomInRange(5,15));
			weapon2 = new weapon(getRandomInRange(4,9), getRandomInRange(4,10), "mag", "Book", null, getRandomInRange(4,12));

			item1 = new item("Vulnerary");

			//display original numbers
			updateDisplay(unit1, unit2);


		}

		//call manual naming function just before randomName call; if manually named, restructure function syntax to include an arg which passes the user's name
		function nameUnit() {

			$("#unit1_info").html("<p>Name unit?</p><p><button class='btn btn-primary' id='manualName'>Yes</button> <button class='btn btn-primary' id='genRandom'>No; generate random</button>");

			$("#manualName").on("click", function() {
				$("#unit1_info").html("<p><input type='text' id='nameInput'></p><p><button class='btn btn-primary' id='submit'>Submit</button> <button class='btn btn-primary' id='genRandom'>Get random instead</button></p>");

				$("#genRandom").on("click", function() {
					getUnitsWithRandomNames();
				});

				$("#submit").on("click", function() {
					var temp = $("#nameInput").val();
					getUnitsWithRandomNames(temp);
				});
			});

			$("#genRandom").on("click", function() {
				getUnitsWithRandomNames();
			});
		}

		nameUnit();

}

function startGame() {
	encapsulation();
}

$(document).ready(function() {
	startGame();
	});
