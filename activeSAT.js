
// ////////////////////////////////
// Aidan Rafferty
// Studio Space
// Fall 2017
// Midterm Project
// Active Satellites JS File
// Professor: Matt Bethancourt
// Special Thanks: Chris Koski
// /////////////////////////////////

//Satellite Objects are made here
var sats = [];

//Arrays for the information for each sat
var satName = [];
var satCountry = [];
var satPurp = [];
var satOrb = [];
var satMass = [];
var satDate = [];
var satVehicle = [];
var satUser = []; 

var numSats = 1458;				//Is 1459 but we start from zero 

var showCountry = "All";		//Used to be able to show only certain aspects of the data
var showPurpose = "All";
var showOrb = "All";
// var showUser = "all";


//Window dimensions to pass to the create canvas function 
var wW = window.innerWidth;
var wH = window.innerHeight;

console.log(wW + " pixels");				//1334
console.log(wH + " pixels");				//758

var table;


function preload()
{
	loadJSON("satDATAFinal.json", logOut);
}

function logOut(data)
{
	for(var i=0; i<data.length; i++)
	{
		//Pushes data into a sat name array 
		//Basically what this does is append the arrays (satXXX) by pushing the data from the JSON using the coinciding JSON names (see JSON File)

		satName.push(data[i].Name);
		satCountry.push(data[i].Country);
		satPurp.push(data[i].Purpose);
		satOrb.push(data[i].Orbit);
		satMass.push(data[i].Mass);
		satDate.push(data[i].Date);
		satVehicle.push(data[i].launchVehicle);
		satUser.push(data[i].Users);
		// console.log(satName[i]);
		// console.log(i);
	}
}

function setup()
{
	//create canvas

	createCanvas(wW, wH);

	//Creates objects for the number of satellites there are given the satNum above
	//This is the important one, the x and y values here are passed to the new SATS!!!
	
	for(var i=0; i<numSats; i++)
	{
		var x = random(width);
		var y = random(height);
		
		var nm = satName[i];
		var ct = satCountry[i];
		var pr = satPurp[i];
		var ob = satOrb[i];
		var ma = satMass[i];
		var dt = satDate[i];
		var vh = satVehicle[i];
		var ur = satUser[i];

		var count = i;		//Using this to pass along the i value with the data to keep it all in lineeeee

		sats.push(new SaT(x, y, nm, ct, pr, ob, ma, dt, vh, ur, count));		//Same thing is going on here as is in LogOut Function, pushing info to arrays
	}

	//Hopefully will set up the hovering ability for the objects
	// sats.mouseOver(hoverOver);

}


//Drawing the background and the satellites in it
//JUST DRAWS

function draw()
{
	background(0);	
	
	for(var i=0; i<numSats; i++)
	{
		//This if statement takes in the showCountry value and displays either all or the filtered Country
		if((showCountry == "All" ||  sats[i].country == showCountry) && (showPurpose == "All" || sats[i].purpose == showPurpose) && (showOrb == "All" || sats[i].orbit == showOrb))
		{
			sats[i].display();

/////////////////////////////////////////////////////////////////////
//show the info for satellites if they are hovered over by the mouse
/////////////////////////////////////////////////////////////////////

			var d = dist(mouseX, mouseY, sats[i].x, sats[i].y);
		
			if(d < sats[i].radius/2)
			{
				sats[i].showInfo();
			} 
			else 
			{
				sats[i].hideInfo();
			}

		}
		
		else 
		{
			sats[i].hideInfo();
		}

		sats[i].update();
	}

	filterInfo();

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Function that does just about everything lol
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////
//HAHAAAA took me a bit to get this straight in my head but I'm gonna explain it to myself now...
//The reason we can check sats.orbit etc. is because in the setup we consolidate all the data points into into variables which are then easily passed here to sats.(SaT(all da dataaaaaa))
// then the this.etc is nice becauseeee it just implies SaT.XXX which is really sats.(SaT.XXX) next time I should name things a little better
//TLDR: SaT.XXX is housed within sats[i]... I need to name better
////////////////////////////////////////


function SaT(x, y, nm, ct, pr, ob, ma, dt, vh, ur, count) 
{
  this.x = x;
  this.y = y;

  this.name = nm;
  this.country = ct;
  this.purpose = pr;
  this.orbit = ob;
  this.mass = ma;
  this.date = dt;
  this.vehicle = vh;
  this.user = ur;

  this.count = count;				//Still passing the i variable from the draw through the rest of the code 

  this.selected = false;			//used to identify if an object is selected or not in update function, also used in display


  ////////////////////////////////////////////////////////////////////
  //Defining the color based on the country of origin
  ////////////////////////////////////////////////////////////////////

  if(this.country == "USA")
  {
  	this.col = color('rgb(0,0,255)');
  }
  else if(this.country == "Russia")
  {
  	this.col = color('rgb(255,0,0)');
  }
  else if(this.country == "China")
  {
  	this.col = color('rgb(247, 247, 12)');
  }
  else if(this.country == "Japan")
  {
  	this.col = color('rgb(247, 164, 0)');
  }
  else if(this.country == "Multinational")
  {
  	this.col = color('rgb(7, 249, 245)');
  }
  else if(this.country == "United Kingdom")
  {
  	this.col = color('rgb(152, 0, 255)');
  }
  else if(this.country == "Canada")
  {
  	this.col = color('rgb(255, 0, 246)');
  }
  else if(this.country == "ESA")
  {
  	this.col = color('rgb(84, 91, 102)');
  }
  else
  {
  	this.col = color(255);
  }

  ////////////////////////////////////////////////////////////////////
  //Defining the size of the object based on the lMass
  ////////////////////////////////////////////////////////////////////

  this.radius = (this.mass * 0.005) + 10;


   /////////Drawing the sats on the display////////////////

  this.display = function() 
  {
    noStroke();			//No outline around objects

    //If statement checks to see if the object is hovered over by the user
    //THis happens before the rest of the object properties because we only want it to happen IF we hover

    if(this.selected) // Implies true if no statement
    {
    	strokeWeight(4);
    	stroke(61, 247, 51);
    }
    
    //Properties for all objects

    fill(this.col);
    ellipse(this.x, this.y, this.radius, this.radius);

  }

  ////////Changing the Info Box and the Highlight Stroke/////////////////
  
  this.showInfo = function() 
  {
  	 var j = this.count;
	 // this.col = color(0, 0, 255);
	 stroke(61,247,51);
	 infoManip(j);
	 this.selected = true;

  }
  
  this.hideInfo = function() 
  {
	 // this.col = color(255);
	 // stroke(255);
	 noStroke();
	 this.selected = false;
  }


  //////////Movement of the objects/////////

  this.update = function()
  {
  	if(this.selected == false)				//movement for when the object is not hovered over
  	{
  		this.x += random(0.4,0.8);
  		this.y += random(-0.1,0.5);
  	}

  	//This bit down here wraps the canvas around and sends the elements to the oppostie side
  	//Notice the smoothness added by doing wW + this.radius

  	if(this.x > wW + this.radius)
  	{
  		// this.x = 0;
  		this.x = this.radius * -1;
  	}

  	if(this.y > wH + this.radius)
  	{
  		this.y = this.radius * -1;
  	}

  }
  

}
//End of this bad boy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Changes the info in the infobox using DOM manipulator

function infoManip(j)
{
	//Making JS elements for the HTML DOM manipulator part
	var name = document.getElementById("name");
	var country = document.getElementById("countryName");
	var purpose = document.getElementById("purpose");;
	var user = document.getElementById("users");
	var orbit = document.getElementById("orbClass");
	var lmass = document.getElementById("mass");
	var lDate = document.getElementById("date");
	var lVehicle = document.getElementById("vehicle");

	//Rewriting the information in for the infobox
	name.innerHTML = satName[j];
	country.innerHTML = satCountry[j];
	purpose.innerHTML = satPurp[j];
	user.innerHTML = satUser[j];
	orbit.innerHTML = satOrb[j];
	lmass.innerHTML = satMass[j] + " kg";
	lDate.innerHTML = satDate[j];
	lVehicle.innerHTML = satVehicle[j]; 

}

function filterInfo()
{
	var filterCountry = document.getElementById("filtCountry");
	var filterPurpose = document.getElementById("filtPurp");
	var filterOrbit = document.getElementById("filtOrb");
	
	filterCountry.innerHTML = showCountry;
	filterPurpose.innerHTML = showPurpose;
	filterOrbit.innerHTML = showOrb;
}

//Shows the dropdown menu

function dropDown()
{
	document.getElementById("dropDown").classList.toggle("show");
}


///////////////////////////////////////////////////////////////////
//Used for the Organize tab to show only certain data aspects
///////////////////////////////////////////////////////////////////
function showAll()
{
	showCountry = "All";
	showPurpose = "All";
	showOrb = "All";
}


function showUSA()
{
	showCountry = "USA";
}


function showRussia()
{
	showCountry = "Russia";
}


function showChina()
{
	showCountry = "China";
}


function showJapan()
{
	showCountry = "Japan";
}


function showMulti()
{
	showCountry = "Multinational";
}


function showUK()
{
	showCountry = "United Kingdom";
}


function showCanada()
{
	showCountry = "Canada";
}


function showESA()
{
	showCountry = "ESA";
}



function showComms()
{
	showPurpose = "Communications";
}


function showTechDev()
{
	showPurpose = "Technology Development";
}


function showEO()
{
	showPurpose = "Earth Observation";
}


function showNav()
{
	showPurpose = "Navigation/Global Positioning";
}


function showSS()
{
	showPurpose = "Space Science";
}

function showLEO()
{
	showOrb = "LEO";
}


function showMEO()
{
	showOrb = "MEO";
}


function showEllip()
{
	showOrb = "Elliptical";
}

function showGEO()
{
	showOrb = "GEO";
}