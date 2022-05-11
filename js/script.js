import {petElements,htmlElements} from '/tamogotchi-virtual-pet/js/components.js';

//* ES6 Class for pet 
class Tamogotchi{
    constructor(tamoName,dataSource){
        this.petName = tamoName;
        this.initialFood = 60;
        this.metabolismRate = 1000;
        
        // load and store the data from json
        fetch(dataSource)
        .then(response => response.json())
        .then(data => {
            this.foodList = data.petFood;
            this.moodList = data.petExpressions;
            this.complimentList = data.petCompliments;
        })
        .catch(err => console.log(err));

        this.disableBtn();
        this.transformOriginSet();
        this.floating();
        this.ufoMotion()
    }
    
    newGame(){
        htmlElements.pharseHeading.innerHTML = "PET SAYS";
        htmlElements.userName.value="";

        this.food=this.initialFood;
        this.metabolismRate=1000;

        // reset functions
        this.vitoAlive()
        this.neutralState()
        clearInterval(this.metabolism)
        clearInterval(this.myTreat)
        this.fetchdata();
        this.disableBtn();
        htmlElements.foodPoints.innerHTML=this.food;
    }

    // * Fetching data again to restock the food after reset or new game
    fetchdata(){
        fetch("assets/data.json")
        .then(response => response.json())
        .then(data => {' '
            this.foodList = data.petFood;
            this.moodList = data.petExpressions;
            this.complimentList = data.petCompliments;
        })
        .catch(err => console.log(err));
    }

    init(){
        if(htmlElements.userName.value==""){
            htmlElements.alertText.innerHTML="Please enter your name*"
        }else{
            htmlElements.alertText.innerHTML=""
            this.hatch()
        }
    }

    // * Starts the Game 
    hatch(){
        this.startMetabolism()
        this.resetFood()
    }

    resetFood(){
        htmlElements.pharseHeading.innerHTML = "PET SAYS";
        this.metabolismRate=1000;
        clearInterval(this.metabolism)
        this.food=this.initialFood;
        htmlElements.foodPoints.innerHTML=this.food;
        this.vitoAlive()
        this.startMetabolism()
        this.neutralState()
    }

    startMetabolism(){
        this.enableBtn();

        this.metabolism = setInterval(()=> {
            this.food--;
            htmlElements.foodPoints.innerHTML=this.food;
            if(this.food<=0){
                this.die();
            }
        },this.metabolismRate);
    }

    die(){
        clearInterval(this.metabolism);
        clearInterval(this.myTreat)
        htmlElements.pharsesDisplay.innerHTML="You killed me! I will haunt you in your dreams"
        this.deadState();
    }

    // * Complimenting the User 
    compliment(){
        htmlElements.pharseHeading.innerHTML = "PET SAYS";
        let personName = document.getElementById("fname").value;
        let personCompliment = this.complimentList[Math.floor(this.complimentList.length*Math.random())];
        let nameWithCompliment = personCompliment.compliment.replace('userName', personName);
        document.getElementById("pharsesDisplay").innerHTML = nameWithCompliment;

        this.startTalking();
    }

    // * Feeding random food to pet 
    randomFood(){
        // No. of food items left in the stock
        this.foodList.forEach((food,index) => {
            if(food.quantity == 0){
                this.foodList.splice(index,1);
            }
        })
        // Checking if food is available or not
        if(this.foodList.length == 0){
            this.food=0
            foodPoints.innerHTML=this.food;
            clearInterval(this.metabolism)
            clearInterval(this.myTreat);
            htmlElements.pharsesDisplay.innerHTML="NO FOOD LEFT. START NEW GAME"
        }else{
            let foodToEat = this.foodList[Math.floor(this.foodList.length*Math.random())];
            foodToEat.quantity-=1;
            let newFoodEat = document.getElementById('pharsesDisplay');
            // If Pet ate poisonous food
            if(foodToEat.contaminationLevel > Math.random()){
                this.food -= foodToEat.foodValue;
                newFoodEat.innerText = `Eww ${foodToEat.foodItem} was horribe. I lost ${foodToEat.foodValue} points.`
                gsap.delayedCall(2,this.sickFace)
                gsap.delayedCall(4.5,this.neutralState);
    ;
            } else{
                    // If Pet ate healthy food
                    this.food += foodToEat.foodValue;
                    newFoodEat.innerText = `Yummy ! ${foodToEat.foodItem} was delicious. I gained ${foodToEat.foodValue} points.`;
                }
            this.startTalking();
        }
    }

    // * Slowing down the Pet's metabolism
    speedDownMetabolism() {
        clearInterval(this.metabolism);
        this.metabolismRate += this.metabolismRate * 3/4;
        this.startTalking();
        htmlElements.pharsesDisplay.innerHTML = "Ahha! I am feeling dizzy. Now my metabolism is slowed down,I can wait for the food"
        console.log(this.metabolismRate);
        this.startMetabolism();
    }
    
    // * Speeding up the Pet's metabolism
    speedUpMetabolism() {
        clearInterval(this.metabolism);
        this.metabolismRate -= this.metabolismRate * 3/4;
        htmlElements.pharsesDisplay.innerHTML = "Thanks for coffee. It increased my metabolism, so now I need more food."
        console.log(this.metabolismRate);
        this.startTalking();
        this.startMetabolism();
    }

    // * FEAST MODE where pet will eat all the food available
    feastMode(){
        if(this.foodList.length >0){
            htmlElements.pharseHeading.innerHTML = "FEAST MODE";
            htmlElements.pharsesDisplay.style.color="white";
            this.myTreat = setInterval(() =>{
                this.randomFood()
            },2000);
        };
    }

    // ******************************* PET ANIMATIONS  **********************************/

    // * SET TRANSFORM ORIGIN OF TARGETS FOR ROTATION 
    transformOriginSet () {

        gsap.config({
            nullTargetWarn: false,
            trialWarn: false,
          });

        gsap.set(petElements.tail, {
            transformOrigin: "bottom center",
        }); 

    }

    // Pet Floating Animation
    floating(){
        gsap.fromTo(
            petElements.vito,
                {
                    y: -3,
                    ease: "none",
                    yoyo: true,
                },
                {
                    duration: 1.5,
                    y: 2,
                    ease: "none",
                    repeat: -1,
                    yoyo: true,
                }
        );
    } 

    // * Pet tail shaking animation
    tailShaking(){
        gsap.fromTo(
            petElements.tail,
                {
                    rotate: -20,
                    ease: "none",
                    yoyo: true,
                },
                {
                    duration: 1,
                    rotate: 20,
                    ease: "none",
                    repeat: -1,
                    yoyo: true,
                }
        );
    } 

    // UFO Moving Motion
    ufoMotion(){
        gsap.fromTo(
            petElements.ufo,
                {
                    x: -50,
                    ease: "none",
                    yoyo: true,
                },
                {
                    duration:3,
                    x: 50,
                    ease: "none",
                    repeat: -1,
                    yoyo: true,
                }
        );
    }
     

    // Eyes animation at happy face
    eyeball(){
        gsap.fromTo(
            petElements.eyeballs,
                {
                    ry: 1,
                    ease: "none",
                    yoyo: true,
                    paused:true
                },
                {
                    duration: 1,
                    ry: 2,
                    ease: "none",
                    repeat: -1,
                    yoyo: true,
                    paused:true
                }
        );
    
    } 
    
    neutralState() {
        gsap.to(petElements.previousEyes, {
            duration: 0.1,
            opacity: 1
        });
        gsap.to(petElements.neutralEyeBrows, {
            duration: 0.1,
            opacity: 1
        });
        gsap.to(petElements.mouth, {
            duration: 0.1,
            opacity: 1
        });
        gsap.to(petElements.deadEyes, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.deadEyeBrows, {
            duration: 0.1,
            opacity: 0,
        });
        gsap.to(petElements.deadMouth, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.deadEyes, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.deadEyeBrows, {
            duration: 0.1,
            opacity: 0,
        });
        gsap.to(petElements.deadMouth, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.angryEyeBrows, {
            duration: 0.1,
            opacity: 0,
            });
        gsap.to(petElements.angryMouth, {
            duration: 0.1,
            opacity: 0,
        });
        gsap.to(petElements.blush1, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.blush2, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.happyMouth, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.sadEyebrows, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.sadMouth, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.sickEyebrows, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.darkCircles, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.sickMouth, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.sickExpression, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.sickMouth2, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.sickMouth2, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.vitoBody, {
            duration:1,
            fill:"#ee3729"
        });
        
    }

    deadState() {
        gsap.to(petElements.deadEyes, {
            duration: 0.1,
            opacity: 1,
        });
        gsap.to(petElements.deadEyeBrows, {
            duration: 0.1,
            opacity: 1
        });
        gsap.to(petElements.deadMouth, {
            duration: 0.1,
            opacity: 1
        });
        gsap.to(petElements.previousEyes, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.neutralEyeBrows, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.mouth, {
            duration: 0.1,
            opacity: 0
        });
        this.vitoDead();
    }

    angryState() {
        gsap.to(petElements.angryEyeBrows, {
            duration: 0.1,
            opacity: 1,
        });
        gsap.to(petElements.angryMouth, {
            duration: 0.1,
            opacity: 0,
        });
        gsap.to(petElements.neutralEyeBrows, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.mouth, {
            duration: 0.1,
            opacity: 0
        });
        this.startTalking();
        setTimeout(()=>{ gsap.to(petElements.angryMouth, {
            duration: 0.5,
            opacity:   1
        }); },2000)
        this.tailShaking()
        gsap.delayedCall(4,this.neutralState)
    }

    happyState(){
        gsap.to(petElements.blush1, {
            duration: 1,
            opacity: 1
        });
        gsap.to(petElements.blush2, {
            duration: 1,
            opacity: 1
        });
        gsap.to(petElements.happyMouth, {
            duration: 0.4,
            opacity: 0
        });
        gsap.to(petElements.previousEyes, {
            duration: 0.1,
            opacity: 1
        });
        gsap.to(petElements.mouth, {
            duration: 0.1,
            opacity: 0
        });
        this.eyeball()
        this.startTalking()
        setTimeout(()=>{ gsap.to(petElements.happyMouth, {
            duration: 0.5,
            opacity:   1
        }); },2000)
        gsap.delayedCall(4,this.neutralState)
    }

    sadState(){
        gsap.to(petElements.sadEyebrows, {
            duration: 0.1,
            opacity: 1
        });
        gsap.to(petElements.sadMouth, {
            duration: 0.1,
            opacity: 0
        }); 
        gsap.to(petElements.neutralEyeBrows, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.mouth, {
            duration: 0.1,
            opacity: 0
        });
        this.startTalking();
        setTimeout(()=>{ gsap.to(petElements.sadMouth, {
            duration: 0.5,
            opacity:   1
        }); },2000)
        gsap.delayedCall(4,this.neutralState);
    }

    sickFace() {
        gsap.to(petElements.neutralEyeBrows, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.mouth, {
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.sickMouth,{
            duration: 0.1,
            opacity: 0
        });
        gsap.to(petElements.sickMouth2, {
            duration: 0.4,
            opacity: 1
        });
        gsap.to(petElements.vitoBody, {
            duration:0.7,
            fill:"green"
        });
        gsap.to(petElements.mouth, {
            duration: 0.1,
            opacity:   0
        });
        gsap.to(petElements.sickEyebrows, {
            duration: 0.1,
            opacity: 1
        });
        gsap.to(petElements.darkCircles, {
            duration: 0.1,
            opacity: 1
        });
        gsap.to(petElements.sickExpression, {
            duration: 0.1,
            opacity: 1
        });
        gsap.fromTo(petElements.sickExpression,{
            y:0,
            yoyo:true,
            ease:"ease"
        },
        {duration:2,
            y:15,
            repeat:-1,
            yoyo:true
        })
        gsap.to(petElements.previousEyes, {
            duration: 0.1,
            opacity: 1
        });
    }

    // Talking face of the Pet 
    startTalking(){
        gsap.fromTo(
            petElements.talkingMouth,
            {
                opacity:1,
                ry: 2,
                ease: "linear",
            },
            {
                duration: 0.5,
                ry: 4,
                ease: "linear",
                repeat: -1,
                yoyo: true,
            });
            setTimeout(() =>{this.stopTalking()},2000)
    }

    stopTalking(){
        gsap.to(
            petElements.talkingMouth,
            {
                duration:0.1,
                opacity:0,
            })
    }

    vitoAlive(){
        gsap.to(petElements.vitoBody, {
            duration: 0.1, fill:"#ee3729"
        });
        gsap.to(petElements.vito,{
            duration:0.2, opacity:1
        });
    }

    // Dead State of the Pet
    vitoDead(){
        gsap.to(petElements.vitoBody, {
            duration: 2, fill:"white"
        });
        gsap.to(petElements.vito,{
            y:-15, duration:1, opacity:0.5
        });
    }

    // **** Pet Sayings according to its mood ****
    petExpressions(mood){
        let petMood = this.moodList.filter(item => item.mood == `${mood}`);

        let randomIndex = Math.floor(Math.random()*petMood.length);
        htmlElements.pharsesDisplay.innerHTML = petMood[randomIndex].speak;
        
        if(mood == "angry" || "jokey"){
            this.tailShaking()
        }
    }

    happyMoodExpression(){
        this.petExpressions("happy")
        this.happyState();
    }

    sadMoodExpression(){
        this.petExpressions("sad")
        this.sadState();
    }

    angryMoodExpression(){
        this.petExpressions("angry")
        this.angryState();
    }

    jokeyMoodExpression(){
        this.petExpressions("jokey")
        this.happyState();
    }

    //Disabling all the buttons before game starts
    disableBtn() {
        document.getElementsByClassName("class-btn").disabled = true;
    }

    enableBtn() {
        document.getElementsByClassName("class-btn").disabled = false;
    }
}

window.onload = function(){
    //* Making instances of the ES6 Class
    let vitos = new Tamogotchi("Vito","assets/data.json");

    document.getElementById("increaseMetabolism").addEventListener("click", () => {
        vitos.speedUpMetabolism()
    });
    document.getElementById("decreaseMetabolism").addEventListener("click", () => {
        vitos.speedDownMetabolism()
    });
    document.getElementById("complimentButton").addEventListener("click", () => {
        vitos.compliment()
    });
    document.getElementById("feedPet").addEventListener("click", () => {
        vitos.randomFood();
    });
    document.getElementById("happyMood").addEventListener("click", () => {
        vitos.happyMoodExpression();
    });
    document.getElementById("angryMood").addEventListener("click", () => {
        vitos.angryMoodExpression();
    });
    document.getElementById("sadMood").addEventListener("click", () => {
        vitos.sadMoodExpression();
    });
    document.getElementById("jokeyMood").addEventListener("click", () => {
        vitos.jokeyMoodExpression();
    });
    document.getElementById("feastMode").addEventListener("click", () => {
        vitos.feastMode();
    });
    document.getElementById("startButton").addEventListener("click", () => {
        vitos.init();
    });
    document.getElementById("resetButton").addEventListener("click", () => {
        vitos.resetFood();
    });
    document.getElementById("newGame").addEventListener("click", () => {
        vitos.newGame();
    });

    setTimeout(
        function open(event){
          document.querySelector('.modal-mask').style.display="block";
        },1000
      );
    
}

document.querySelector('#close').addEventListener("click", function(){
  document.querySelector(".modal-mask").style.display = "none";
})
