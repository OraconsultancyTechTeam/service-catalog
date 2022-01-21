/*
*   Change stage when clicked
*/
$('.stages').click(function () {
    var id = $(this).attr('id')
    var stage = document.getElementById(id).innerHTML
    $('#current_stage').html(stage)
    blockController(stage)
    
    // Need to add in loading content specific to chosen stage
    // and set to content div
})

//this controlle opens and closes blocks
function blockController(stage){
  switch(stage) {
    case 'Database Engine':
      document.getElementById('block1').style.display='block'
      document.getElementById('block2').style.display='block'

      document.getElementById('block3').style.display='none'
     
      break;
    case 'Features':
      document.getElementById('block1').style.display='none'
      document.getElementById('block2').style.display='none'

      document.getElementById('block3').style.display='block'
      
      break;
    default:
      var stage_id = document.getElementById('current_stage').innerHTML.replace(/\s+/g,'')
      $('#' + stage_id)+'1'.html(element)
  }

}




/*
*   When a card option is clicked
*/
/*
$(".card").click(function () {
    var inputElement = $(this).find('input[type=radio]').attr('id')
    console.log(inputElement)
    var stage_id = document.getElementById('current_stage').innerHTML
    $(this).find('input[type=radio]').prop('checked', true)
    stepToBackend(inputElement,stage_id)
    filterTest(inputElement);
    // cardCheck(inputElement);
    changeText(inputElement);
});
*/
function clickTheCard(item,option){
  var inputElement = $(item).find('input[type=radio]').attr('id')
    
    $(item).find('input[type=radio]').prop('checked', true)
    
    filterTest(inputElement);
    // cardCheck(inputElement);
    changeText(inputElement,option);
    var stage_id = document.getElementById('current_stage').innerHTML
    stepToBackend(inputElement,stage_id)
}

function stepToBackend(inputElement, stage_id) {
    var http = new XMLHttpRequest();
    http.open("POST", "/catalog", true);
    http.setRequestHeader("Content-type","application/json")
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {

        
        if (!$('#group2').has('div').length) {
          step2 = JSON.parse(http.response)
         // console.log(step2)          
          step2.forEach(card => {
            var newdiv = document.createElement('div')
            newdiv.setAttribute('id',card.option_heading.replace(/\s+/g,'') + '-card')
            newdiv.setAttribute('class','card group2 card-settings')
            newdiv.setAttribute('style','text-align: center; max-width: 204px;')
            newdiv.setAttribute('onclick',"clickTheCard(this,2)")
            var img = document.createElement('img')
            img.setAttribute('class','card-img-top mx-auto mt-1')
            img.setAttribute('src','/img/' + card.option_heading.replace(/\s+/g,'') + '.png')
            img.setAttribute('style','width:5rem; height:5rem;')
            img.setAttribute('alt','Card image cap')
            var button = document.createElement('div')
            button.setAttribute('class','card-body')
            button.setAttribute('role','button')
            var head = document.createElement('h6')
            head.setAttribute('class', 'card-title')
            var label = document.createElement('label')
            var input = document.createElement('input')
            input.setAttribute('id',card.option_heading)
            input.setAttribute('value',card.option_heading)
            input.setAttribute('type','radio')
            input.setAttribute('name','radio2')
            label.setAttribute('for',card.option_heading)
            label.innerHTML = card.option_heading
            $(newdiv).append(img,button)
            $(button).append(head)
            $(head).append(input,label)
            $('#group2').append(newdiv)
          })
        } 
        else {
          var stage = document.getElementById("stage2").innerHTML
          $('#current_stage').html(stage)
          blockController(stage)
          getStep3(stage)
          
        }
        
      }
    }
    var params = JSON.stringify({ 'stepCard': inputElement, stage_id })
    http.send(params);
}


function getStep3(stage_id){
  var http = new XMLHttpRequest();
    http.open("POST", "/catalog", true);
    http.setRequestHeader("Content-type","application/json")
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        step3 = JSON.parse(http.response)
        //console.log(step3)
        select = document.getElementById('envSelect');
        
        step3.forEach(card => { 

          if(card.option_id==1){
           // console.log("The card id is: "+card.option_id+". The card heading is: "+card.option_heading)
            // Append the option to select
            $('#envSelect').append('<option value="'+card.option_heading+'">'+card.option_heading+'</option>');
  
            // Set the select value with new option
             $("#envSelect").val(card.option_heading);
  
            // Refresh the selectpicker
             $("#envSelect").selectpicker("refresh");
          }
          
         }) 


      }}
    var params = JSON.stringify({stage_id })
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
function changeText(element,option){

   switch(option) {
    case 1:
      var stage_id = document.getElementById('current_stage').innerHTML.replace(/\s+/g,'')
      $('#' + stage_id+'1').html(element)
      document.getElementById('block2').style.display='block'
     
      break;
    case 2:
      var stage_id = document.getElementById('current_stage').innerHTML.replace(/\s+/g,'')
      $('#' + stage_id+'2').html(element);
      document.getElementById(stage_id+'2').style.display='block'
      
      break;
    default:
      var stage_id = document.getElementById('current_stage').innerHTML.replace(/\s+/g,'')
      $('#' + stage_id)+'1'.html(element)
  }
    

}


