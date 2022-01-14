/*
*   Change stage when clicked
*/
$('.stages').click(function () {
    var id = $(this).attr('id')
    var stage = document.getElementById(id).innerHTML
    $('#current_stage').html(stage)
    
    // Need to add in loading content specific to chosen stage
    // and set to content div
})

/*
*   When a card option is clicked
*/
$(".card").click(function () {
    var inputElement = $(this).find('input[type=radio]').attr('id')
    var stage_id = document.getElementById('current_stage').innerHTML
    //console.log(inputElement)
    $(this).find('input[type=radio]').prop('checked', true)
    stepToBackend(inputElement,stage_id)
    filterTest(inputElement);
    // cardCheck(inputElement);
    changeText(inputElement);
});

function stepToBackend(inputElement, stage_id) {
    var http = new XMLHttpRequest();
    http.open("POST", "/catalog", true);
    http.setRequestHeader("Content-type","application/json")
    // http.onreadystatechange = () => {
    //   if (http.readyState === 4 && http.status === 201) {
    //     var object = JSON.parse(http.response)
    //     console.log(object)
    //   }
    // }
    var params = JSON.stringify({ 'stepCard': inputElement, stage_id })
    http.send(params);
}

function unclickRadio() {
    $("input:radio").prop("checked", false);
}

function clickRadio(inputElement) {
    $("#"+inputElement).prop("checked", true);
}

function makeSelect(element, group){

    $(".card").filter("."+group).filter(".selected").removeClass("selected").addClass("unselected");
    $('.' + group).addClass('unselected')
    //$("input:radio").filter("."+group).prop("checked", false);     
    $("#" + element + "-card").removeClass("unselected").addClass("selected");
    // $("#"+element).prop("checked", true);

}

function filterTest(element){
    var id = element.replace(/\s+/g,'')
    if ($("#" + id + "-card").hasClass("group1")) {
        makeSelect(id, "group1");
    }
    else if ($("#" + id + "-card").hasClass("group2")) {
        makeSelect(id, "group2");
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

/*
*   Update service details
*/
function changeText(element){
    
    var stage_id = document.getElementById('current_stage').innerHTML.replace(/\s+/g,'')
    $('#' + stage_id).html(element)

}