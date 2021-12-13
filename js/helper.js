let universityList = [];
let deptList = [];

const categories = {
  caseDescription: "Case Description", 
  partnership: "Partnership",
  linkage: "Linkage and Integration",
  service: "Meaningful Service activities",
  reflection: "Reflection",
  assessment: "Assessment for learning",
  support: "Support System",
  communityPractice: "Communities of practice",
  evaluation: "Evaluation and improvement",
  challenges: "Challanges"
};

const categoriesCn = {
  caseDescription: "個案說明",
  partnership: "夥伴合作關係",
  linkage: "聯結及整合課程",
  service: "具意義的服務活動",
  reflection: "反思",
  assessment: "學習評核",
  support: "支援系統",
  communityPractice: "實踐社群",
  evaluation: "課程評估及改進",
  challenges: "應對挑戰"
}

function loadModule(lang){
  universityList = [...new Set(data.filter(x=> typeof(x.university) == "string").map(x => x.university))];
  deptList = [...new Set(data.filter(x=> x.department).map(x => x.department))];
}   

var panelCount = 0;
var selectedCategories;

function populateData(params, id) {
  id = "#" + id;
  if (typeof params == "string") {
    $(id).append("<p class = 'content'>" + params + "</p>");
  } else {
    for (var content of params) {
      $(id).append("<h5>" + content.header + "</h5>");
      $(id).append("<p class = 'content'>" + content.text + "<p>");
    }
  }
}

function addPreamble(key, caseTitle, department, university, lecturer) {
  let practice = " practice";

  if(key == 'caseDescription')
    practice = "";
  
  if(!department)
    department = "XXXX";
  
  $('#' + key).append($("<div class='preamble'></div>")
  .append("<p><b>Case Title: </b>" + caseTitle + "</p>")
  .append("<p><b>Offering Department: </b>" + department + "</p>")
  .append("<p><b>Institution: </b>" + university + "</p>")
  .append("<p><b>Interviewed Teacher: </b>" + lecturer + "</p>"))
}

function createAccordion(category){
  panelCount++;
  $( ".accordion" ).append($('<div></div>').addClass('accordion-item').attr({id: 'item' +panelCount})
    .append($('<h2></h2>').attr({id: 'heading' + panelCount}).addClass('accordion-header')
      .append($('<button></button>').text(categoriesCn[category]).addClass('accordion-button').attr({type: 'button', "data-bs-toggle": 'collapse', "data-bs-toggle": 'collapse', "data-bs-target":"#collapse" + panelCount}))));

  $('#item' + panelCount).append($('<div></div>').addClass('accordion-collapse collapse show').attr({id: "collapse" + panelCount,"aria-labelledby":"heading" + panelCount})
    .append($('<div></div>').addClass("accordion-body").attr({id : category}).css("white-space", "pre-wrap")));
}

function getResult() {
  var filteredData = [];
  var filter = {
    university: $('#universitySelect').val() ,
    department: $('#departmentSelect').val(),
    domain: $('#domain').val(),
    caseCode: $('#caseCode').val(),
    caseTitle: $('#caseTitle').val(),
    categories: $("#categories :selected").map((_, e) => e.value).get()
  }
  console.log(filter.department)
  if (filter.categories.length > 0){
    $("#categories").removeClass("is-invalid");
    $("#error").hide();

    let filterCategories = (arr, target) => target.every(v => arr.includes(v));

    let filteredData = [];
    filteredData = data.filter(x => filter.university ? x.university == filter.university || x.university.includes(filter.university) : true);
    filteredData = filteredData.filter(x => filter.department ? x.department == filter.department : true);
    filteredData = filteredData.filter(x => filter.domain ? x.domain.toLowerCase().includes(filter.domain.toLowerCase()) : true);
    filteredData = filteredData.filter(x => filter.caseCode ? x.caseCode == filter.caseCode : true);
    filteredData = filteredData.filter(x => filter.caseTitle ? x.caseTitle.toLowerCase().includes(filter.caseTitle.toLowerCase()) : true);
    filteredData = filteredData.filter(x => filterCategories(Object.keys(x.details), filter.categories));

    $('.result').show();
    if(filteredData.length > 0){
      $('#success-result').empty();
      $('.accordion').empty();
      for (var key of filter.categories){
        $('#' + key).empty();
        createAccordion(key);
        for(var record of filteredData){
          addPreamble(key, record.caseTitle, record.department, record.university, record.lecturer);
          populateData(record.details[key].content, key);
          $("#" + key).append("<hr/>")
        }
      }
      $('.success-result').show();
      $('.no-result').hide();
    }
    else {
      $('.no-result').show()
      $('.success-result').hide();
    }
  }
  else {
    $("#categories").addClass("is-invalid");
    $("#error").show();
    $('.result').hide();
  }
}
