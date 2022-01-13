$(document).ready(function () {
    $('input:radio').change(function () {//Clicking input radio
        var radioClicked = $(this).attr('id');
        filterTest(radioClicked);
    });
});

$(".card").click(function () {//Clicking the card
    var inputElement = $(this).find('input[type=radio]').attr('id');
    $(this).find('input[type=radio]').prop('checked', true)
    stepToBackend(inputElement)
    filterTest(inputElement);
    cardCheck(inputElement);
    changeText(inputElement);
});

function stepToBackend(inputElement) {
    var http = new XMLHttpRequest();
    http.open("POST", "/catalog", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "stepCard=" + inputElement;
    http.send(params);
}

// function step1ToBackend(inputElement) {
//     var http = new XMLHttpRequest();
//     http.open("POST", "/catalog", true);
//     http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//     var params = "step1Card=" + inputElement;
//     http.send(params);
// }

// function step2ToBackend(inputElement) {
//     var http = new XMLHttpRequest();
//     http.open("POST", "/catalog", true);
//     http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//     var params = "step2Card=" + inputElement;
//     http.send(params);
// }

function unclickRadio() {
    $("input:radio").prop("checked", false);
}

function clickRadio(inputElement) {
    $("#"+inputElement).prop("checked", true);
}

function removeopen() {
    $(".card").removeClass("selected");
}

function makeopen(element) {
    $("#" + element + "-card").addClass("selected");
}

function makeSelect(element, group){

  $(".card").filter("."+group).filter(".selected").removeClass("selected").addClass("unselected");
  $("input:radio").filter("."+group).prop("checked", false);     
  $("#" + element + "-card").removeClass("unselected").addClass("selected");
  $("#"+element).prop("checked", true);

}

function filterTest(element){

  if ($("#" + element + "-card").hasClass("group1")){
    makeSelect(element, "group1");
  }
  else if ($("#" + element + "-card").hasClass("group2")){
    makeSelect(element, "group2");
  }
}

function cardCheck(element) {

  var id = document.getElementById(element);

  // Step 1 - Host
  if (document.getElementById("step1").contains(id)) {

    switch(element) {
      case "On-Prem Database":
        $("#s1").collapse('hide');
        $("#s2-1").collapse('show');
        $("#s2-2").collapse('hide');
        break;

      case "Cloud Database":
        $("#s1").collapse('hide');
        $("#s2-1").collapse('hide');
        $("#s2-2").collapse('show');
        break;

      case "Replication - Goldengate":
        $("#s1").collapse('hide');
        $("#s2-1").collapse('hide');
        $("#s2-2").collapse('hide');   
        break;

      case "Replication - Nifi":
        $("#s1").collapse('hide');
        $("#s2-1").collapse('hide');
        $("#s2-2").collapse('hide');    
        break;

      case "Replication - Kafka":
        $("#s1").collapse('hide');
        $("#s2-1").collapse('hide');
        $("#s2-2").collapse('hide'); 
        break;
      
      default:
          console.log("Error");
    }

    $("#cont1").css("display", "none")
    $("#header1").removeClass("open");
  
    // Scroll to Step 2.1
    setTimeout(function () {
      document.querySelector("#cont2").scrollIntoView({ behavior: "smooth" });    
    }, 350);
    
    // Setting service details height to be centered in all viewports
    var servDetHeight = document.querySelector('#servDetails').offsetHeight;
    var offsetServDet = servDetHeight / 2;
    $('#servDetails').css('top', window.innerHeight / 2 - offsetServDet)
  }

  // Step 2.1 - Database
  else if (document.getElementById("s2-1").contains(id)) {
    
    switch(element) {
      case "Oracle-Database":
        $("#s3").collapse('show');
        break;
      case "SQL-Server":
        $("#s3").collapse('show');
        break;
      case "My-SQL":
        $("#s3").collapse('show');          
        break;
      case "Apache-Cassandra":
        $("#s3").collapse('show');             
        break;
      case "Redis":
        $("#s3").collapse('show');            
        break;
      
      default:
          console.log("Error");
    }

    $("#cont2").css("display", "none");
    $("#header2").removeClass("open");
    
    // Scroll to Step 2.2
    setTimeout(function () {
      document.querySelector("#cont3").scrollIntoView({ behavior: "smooth" });    
    }, 350);
    

    // Setting service details height to be centered in all viewports
    var servDetHeight = document.querySelector('#servDetails').offsetHeight;
    var offsetServDet = servDetHeight / 2;
    $('#servDetails').css('top', window.innerHeight / 2 - offsetServDet)
  }

  // Step 2.2 - Database
  else if (document.getElementById("s2-2").contains(id)) {
    
    switch(element) {
      case "Oracle-RDS":
        $("#s3").collapse('show');
        break;
      case "SQL-RDS":
        $("#s3").collapse('show');
        break;
      default:
          console.log("Error");
    }

    $("#cont2.2").css("display", "none");
    $("#header2.2").removeClass("open");

    // Scroll to Step 3
    setTimeout(function () {
      document.querySelector("#cont3").scrollIntoView({ behavior: "smooth" });    
    }, 350);

    // Setting service details height to be centered in all viewports
    var servDetHeight = document.querySelector('#servDetails').offsetHeight;
    var offsetServDet = servDetHeight / 2;
    $('#servDetails').css('top', window.innerHeight / 2 - offsetServDet)
  }
}

function changeText(element){

  var id = document.getElementById(element);

  if (document.getElementById("step1").contains(id)) {
    $('#step1-text').html(element);
    $('#step2-text').html("");
  }
  else if (document.getElementById("s2-1").contains(id)) {
    $('#step2-text').html(element);
  }
  else if (document.getElementById("s2-2").contains(id)) {
    $('#step2-text').html(element);
  }
  else {
    console.log('error changing text')
  }
}

//collapisbile div button
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    triggerCollapisble(this);
  });
}

function triggerCollapisble(element) {
  element.classList.toggle("open");
    var content = element.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
}

/* For smaller viewports */
$(window).resize(function () {

  if (innerWidth <= 492) {
    var serv = document.getElementById('servDetails');
    var dets = document.getElementById('detail-div');
    
    //dets.classList.add('collapsible')
    serv.style.cursor = 'pointer';

    serv.addEventListener('click', function () {
      if (dets.style.display === "block") {
        dets.style.display = "none";
      } else {
        dets.style.display = "block";
      }
    })

  } else {
    //serv.style.cursor = 'auto';
    //dets.style.display = "block";
  }

})

$('.stages').click(function () {
  var id = $(this).attr('id')
  console.log(id)
})