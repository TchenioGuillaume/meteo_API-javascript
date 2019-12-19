function sayHi(e) {
	e.preventDefault();
}

// let titre = document.querySelector('body');
// titre.addEventListener("click", function(){
//   this.classList.toggle('bgRed');
// });


(function($, document, window){
	
	$(document).ready(function(){

		let citySaved = accessCookie('citySaved');
		if (citySaved) {
			callApi(citySaved);
		}

		$("[data-submit-location]").click(function () {
			let city = $("[data-wanted-location]").val();
			callApi(city);
		});

	});


})(jQuery, document, window);


function calculMoyenne(tab) {
	let valeur = 0;
	tab.forEach(function(e){
		valeur += e;
	});
	return Math.round(valeur/tab.length);
}

function ucFirst(str) {
	if (str.length > 0) {
	  return str[0].toUpperCase() + str.substring(1);
	} else {
	  return str;
	}
  }


let degToCard = function(deg){
	if (deg>11.25 && deg<=33.75){
	  return "NNE";
	}else if (deg>33.75 && deg<=56.25){
	  return "ENE";
	}else if (deg>56.25 && deg<=78.75){
	  return "East";
	}else if (deg>78.75 && deg<=101.25){
	  return "ESE";
	}else if (deg>101.25 && deg<=123.75){
	  return "ESE";
	}else if (deg>123.75 && deg<=146.25){
	  return "SE";
	}else if (deg>146.25 && deg<=168.75){
	  return "SSE";
	}else if (deg>168.75 && deg<=191.25){
	  return "Sud";
	}else if (deg>191.25 && deg<=213.75){
	  return "SSW";
	}else if (deg>213.75 && deg<=236.25){
	  return "SW";
	}else if (deg>236.25 && deg<=258.75){
	  return "WSW";
	}else if (deg>258.75 && deg<=281.25){
	  return "West";
	}else if (deg>281.25 && deg<=303.75){
	  return "WNW";
	}else if (deg>303.75 && deg<=326.25){
	  return "NW";
	}else if (deg>326.25 && deg<=348.75){
	  return "NNW";
	}else{
	  return "Nord"; 
	}
  }

function weatherToIcon(weather) {
	switch (weather) {
		case 'Clear':
			return "icon-2.svg";
		  break;
		case 'Clouds':
			return "icon-5.svg";
		  break;
		case 'Rain':
		  return "icon-10.svg";
		  break;
		case 'Mist':
		  return "icon-8.svg";
		  break;
		case 'Drizzle':
		  return "icon-9.svg";
		  break;
		case 'Thunderstorm':
		  return "icon-11.svg";
		  break;
		case 'Snow':
		  return "icon-14.svg";
		  break;
	  }
}  

function callApi (city) {

	$.ajax({
		url: "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&APPID=667521b7516cbfcc93ff36baae27b19d",

		success: function(data) {
			fillData(data);
			createCookie("citySaved", city, 100);
			$("[data-weather-container]").removeClass("noDisplay");
		},
		error: function() {
			$("[data-weather-container]").addClass("noDisplay");
		}	
	});
}

function fillData (data) {
	console.log(data);
	$("[data-location]").html(data.city.name +" "+data.city.country);

	let oldDay = new Date();
	let all = [];
	let allHumidity = [];
	let allWindSpeed = [];
	let allWindDeg = [];
	let allWeatherDesc = [];
	let weather = [];
	let humidity = [];
	let windSpeed = [];
	let windDeg = [];
	let weatherDesc = [];

	data.list.forEach(function(element){
		let day = new Date(element.dt_txt);
		
		if (oldDay.getDate() == day.getDate()) {
			weather.push(element.main.temp);
			humidity.push(element.main.humidity);
			windSpeed.push(element.wind.speed);
			windDeg.push(element.wind.deg);
			weatherDesc.push(element.weather[0].main);
		} else {
			all[day] = calculMoyenne(weather);
			allHumidity.push(calculMoyenne(humidity));
			allWindSpeed.push(calculMoyenne(windSpeed));
			allWindDeg.push(calculMoyenne(windDeg));
			allWeatherDesc.push(getTheMost(weatherDesc));
			humidity = [];
			weather = [];
			windSpeed = [];
			windDeg = [];
			weatherDesc = [];
			oldDay = day;
		}
	});

	function fondEcran(iconWeather) {
		let bg = document.querySelector('.site-content');
		switch (iconWeather) {
			case 'icon-2.svg': // Clear
				bg.style.background = 'url(images/Clear.jpg) no-repeat center center fixed';
				break;
			case 'icon-5.svg': // Clouds
				bg.style.background = 'url(images/Clouds.jpg) no-repeat center center fixed';	
				break;
			case 'icon-10.svg': // Rain
				bg.style.background = 'url(images/Rain.jpg) no-repeat center center fixed';
				break;
			case 'icon-8.svg': // Mist
				bg.style.background = 'url(images/Mist.jpg) no-repeat center center fixed';
				break;
			case 'icon-9.svg': // Drizzle
				bg.style.background = 'url(images/Rain.jpg) no-repeat center center fixed';
				break;
			case 'icon-11.svg': // Thunderstorm
				bg.style.background = 'url(images/Thunderstorm.jpg) no-repeat center center fixed';
				break;
			case 'icon-14.svg': // Snow
				bg.style.background = 'url(images/Snow.jpg) no-repeat center center fixed';
				break;
			}
	}

	//gere les icones
	let y = 0;
	for (let z = 1; z <= allWeatherDesc.length; z++) {
		let weather = allWeatherDesc[y];
		let icon = weatherToIcon(weather);
		if (z == 1) {
			$("[data-icon-weather-d"+z+"]").html('<img src="images/icons/'+icon+'" alt="" width=90>');
			fondEcran(icon);
		} else {
			$("[data-icon-weather-d"+z+"]").html('<img src="images/icons/'+icon+'" alt="" width=48>');
		}		
		y++;
	}

	//affiche la temperature jours et date
	let i = 1; 
	for (let k in all) {
		$("[data-degre-d"+i+"]").html(all[k] + "°C");
		let option = {weekday: "long"}
		let date = new Date(k);
		date.setDate(date.getDate()-1);
		$("[data-day-d"+i+"]").html(ucFirst(date.toLocaleDateString('fr-FR', option)));
		i++;
	}

	// humidité
	let k = 0;
	for (let i = 1; i <= allHumidity.length; i++) {
		$("[data-humidity-d"+i+"]").html('<img src="images/icon-umberella.png" alt=""> '+allHumidity[k] + "%");
		k++;
	}

	//vent
	$("[data-wind-d1]").html('<img src="images/icon-wind.png" alt="">'+Math.round(allWindSpeed[0]*3.6) + "km/h");
	$("[data-wind-dir-d1]").html('<img src="images/icon-compass.png" alt="">'+degToCard(allWindDeg[0]));

	//Gere la date du jour
	let date = new Date();
	let option = {day: "numeric", month: "long"}
	$("[data-date-d1]").html(ucFirst(date.toLocaleDateString('fr-FR', option)));

}

function createCookie(cookieName,cookieValue,daysToExpire)
{
    var date = new Date();
    date.setTime(date.getTime()+(daysToExpire*24*60*60*1000));
    document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString();
}


function accessCookie(cookieName)
{
    let name = cookieName + "=";
    let allCookieArray = document.cookie.split(';');
    for(let i=0; i<allCookieArray.length; i++)
    {
        let temp = allCookieArray[i].trim();
        if (temp.indexOf(name)==0)
        return temp.substring(name.length,temp.length);
    }
    return "";
}

function getTheMost(array) {
	if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}


$("[data-geolocate]").click(function () {
	geolocate();

});

function callback(result) {
	callApi(result);
}

function geolocate () {
	$.ajax('http://ip-api.com/json')
	.then(
		function success(response) {
			callback(response.city);
			console.log(response);
		},
  
		function fail(data, status) {
			console.log('Request failed.  Returned status of',
						status);
		}
	);
  }





	