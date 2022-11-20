import suite_data from '../data/suite_execution_data1.json' assert { type: 'json' };
import test_case_data from '../data/test_case_data1.json' assert { type: 'json' };

let filtered_test_case_data;
let borderStyle;
let modal = document.getElementById("myModal");
let modalTC = document.getElementById("myModalTestCaseDetails");
let search_components = document.querySelectorAll(".search_components > input");

function searchTestSuite(search_components) {
  let start_date = Date.parse(search_components[0].value);
  let end_date = Date.parse(search_components[1].value);
  let only_passed = search_components[2].checked;
  let only_failed = search_components[3].checked;
  let filtered_data = suite_data;
  let filtered_data_with_dates;

  if (start_date && end_date) {
    if (start_date > end_date) {
      alert("Start date must be before end date!");
      search_components[0].value = "";
      search_components[1].value = "";
      return;
    } else {
      filtered_data_with_dates = suite_data.filter(function (suite) {
        let suite_start_date = Date.parse(suite['start date']);
        let suite_end_date = Date.parse(suite['end date']);
        return suite_start_date >= start_date && suite_end_date <= end_date;
      });
    }
  }

  if (only_passed && !only_failed) {
    if (start_date && end_date) {
      filtered_data_with_dates = filtered_data_with_dates.filter(function (suite) {
        return suite['passed'] > suite['failed'];
      });
    }
    else {
      filtered_data = suite_data.filter(function (suite) {
        return suite['passed'] > suite['failed'];
      });
    }
  }

  if (only_failed && !only_passed) {
    if (start_date && end_date) {
      filtered_data_with_dates = filtered_data_with_dates.filter(function (suite) {
        return suite['passed'] <= suite['failed'];
      });
    }
    else {
      filtered_data = suite_data.filter(function (suite) {
        return suite['passed'] <= suite['failed'];
      });
    }
  }

  if (only_passed && only_failed) {
    if (!start_date && !end_date) {
      filtered_data = suite_data;
    }
  }

  $('#testSuiteTable').empty();

  if (start_date && end_date) {
    testSuiteTableDynamics(filtered_data_with_dates);
  } else {
    testSuiteTableDynamics(filtered_data);
  }
}

function testSuiteTableDynamics(filtered_data) {
  var table = $('#testSuiteTable');
  var b;
  if (filtered_data) {
    b = filtered_data;
  }
  else {
    b = suite_data;
  }
  var max_size = b.length;
  var sta = 0;
  var elements_per_page = 7;
  var limit = elements_per_page;
  goFun(sta, limit);
  function goFun(sta, limit) {
    for (var i = sta; i < limit; i++) {
      let totals_not_passed = 0;
      if (b[i]) {
        totals_not_passed = b[i]['failed'];


        if (b[i]['passed'] > totals_not_passed) {
          b[i]['status'] = true;
        }
        else {
          b[i]['status'] = false;
        }

        if (b[i]['status']) {
          borderStyle = 'style="border: 2px solid forestgreen;"';
        }
        else {
          borderStyle = 'style="border: 2px solid red;"';
        }



        var $nr = $(
          '<tr class="test_suite_row">' +
          '<td ' + borderStyle + '>' + b[i]['id'] + '</td>' +
          '<td ' + borderStyle + '>' + b[i]['name'] + '</td>' +
          '<td ' + borderStyle + '>' + b[i]['start date'] + '</td>' +
          '<td ' + borderStyle + '>' + b[i]['start time'] + '</td>' +
          '<td ' + borderStyle + '>' + b[i]['end date'] + '</td>' +
          '<td ' + borderStyle + '>' + b[i]['end time'] + '</td>' +
          '<td ' + borderStyle + '>' + b[i]['test cases'] + '</td>' +
          '<td ' + borderStyle + '>' + b[i]['passed'] + '</td>' +
          '<td ' + borderStyle + '>' + b[i]['failed'] + '</td>' +
          '<td ' + borderStyle + '>' + b[i]['skipped'] + '</td>' +
          '<td ' + borderStyle + '>' + b[i]['blocked'] + '</td>' +
          '<td ' + borderStyle + '>' + b[i]['not executed'] + '</td>' +
          '<td ' + borderStyle + '>' + b[i]['status'] + '</td>' +
          '</tr>'
        );
        table.append($nr);
      }
    }
  }

  $('#nextValue').click(function () {

    var next = limit;
    if (max_size >= next) {
      limit = limit + elements_per_page;
      table.empty();
      goFun(next, limit);
      addToggleModalEvents();
    }
  });

  $('#PreeValue').click(function () {
    var pre = limit - (2 * elements_per_page);
    if (pre >= 0) {
      limit = limit - elements_per_page;
      table.empty();
      goFun(pre, limit);
      addToggleModalEvents();
    }
  });

  addToggleModalEvents();
}

function addToggleModalEvents() {
  let closeModalBtn = document.getElementById("closeModal");
  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
    $('#testCaseTable').empty();
  });

  modal.style.display = "none";
  $('#testCaseTable').empty();
  document.querySelectorAll('.test_suite_row').forEach(item => {
    item.addEventListener('click', function (event) {
      if (modal.style.display === "none") {
        modal.style.display = "block";
      } else {
        modal.style.display = "none";
        $('#testCaseTable').empty();
      }

      let test_suite_id = event.target.parentElement.firstChild.textContent;
      let test_suite_name = event.target.parentElement.firstChild.nextSibling.textContent;

      filtered_test_case_data = test_case_data.filter(function (test_case) {
        return test_case.from_test_suite_execution == test_suite_id;
      });

      $('#testCasesParagraph').text('Test Cases for ' + test_suite_name + ' (Execution of ID: ' + test_suite_id + ')');

      fillTestCaseTable(filtered_test_case_data);
    })
  });
}

function addToggleModalTCEvents() {
  let closeModalBtn = document.getElementById("closeModalTestCaseDetails");
  closeModalBtn.addEventListener("click", function () {
    modalTC.style.display = "none";
    $("#modalDataTestCaseDetails").get(0).innerHTML = "";
  });

  modalTC.style.display = "none";
  $("#modalDataTestCaseDetails").get(0).innerHTML = "";
  document.querySelectorAll('.test_case_row').forEach(item => {
    item.addEventListener('click', function (event) {
      if (modalTC.style.display === "none") {
        modalTC.style.display = "block";
      } else {
        modalTC.style.display = "none";
        $("#modalDataTestCaseDetails").get(0).innerHTML = "";
      }

      let test_case_id = event.target.parentElement.firstChild.textContent;
      let test_case_name = event.target.parentElement.firstChild.nextSibling.textContent;

      let test_case_data = filtered_test_case_data[test_case_id - 1]

      let divModalDataTestCaseDetails = document.getElementById("modalDataTestCaseDetails");
      divModalDataTestCaseDetails.innerHTML =
        '<p class="tc_header"><b>Test Case Details for ' + test_case_name + ' (ID: ' + test_case_id + ')</b>' +
        '<p><b>Status of the Execution:</b> ' + test_case_data['status'] + '</p>' +
        '<p class="tc_description"><b>Description: </b>' + test_case_data['description'] + '</p>' +
        '<p class="tc_expected_result"><b>Expected Result: </b>' + test_case_data['expected result'] + '</p>';

      test_case_data['evidence'].forEach(function (evidence) {
        if (evidence["type"] == "image") {
          divModalDataTestCaseDetails.innerHTML +=
            '<p class="tc_multimedia"><b>Multimedia: </b></p>' +
            '<img class="tc_evidence" src="' + evidence["data"] + '">';
        }
        else if (evidence["type"] == "video") {
          divModalDataTestCaseDetails.innerHTML +=
            '<video class="tc_evidence" src="' + evidence["data"] + '" controls></video>';
        }
        else if (evidence["type"] == "log") {
          divModalDataTestCaseDetails.innerHTML += '<p class="tc_evidence"><b>Logs: </b>' + evidence["data"] + '</p>';
        }
      });
    })
  });
}

function fillTestCaseTable(filtered_test_case_data) {
  var table = $('#testCaseTable');
  if (filtered_test_case_data) {
    var b = filtered_test_case_data;
    var max_size = b.length;
    var sta = 0;
    var elements_per_page = 7;
    var limit = elements_per_page;
    goFun(sta, limit);
    function goFun(sta, limit) {
      for (var i = sta; i < limit; i++) {
        if (b[i]) {

          if (b[i]['status']) {
            borderStyle = 'style="border: 2px solid forestgreen;"';
          }
          else {
            borderStyle = 'style="border: 2px solid red;"';
          }

          var $nd = $(
            '<tr class="test_case_row">' +
            '<td ' + borderStyle + '>' + b[i]['id'] + '</td>' +
            '<td ' + borderStyle + '>' + b[i]['name'] + '</td>' +
            '<td ' + borderStyle + '>' + b[i]['start date'] + '</td>' +
            '<td ' + borderStyle + '>' + b[i]['start time'] + '</td>' +
            '<td ' + borderStyle + '>' + b[i]['end date'] + '</td>' +
            '<td ' + borderStyle + '>' + b[i]['end time'] + '</td>' +
            '<td ' + borderStyle + '>' + b[i]['steps count'] + '</td>' +
            '<td ' + borderStyle + '>' + b[i]['status'] + '</td>' +
            '</tr>'
          );
          table.append($nd);
        }
        else {
          break;
        }
      }
    }

    $('#nextValueTC').click(function () {

      var next = limit;
      if (max_size >= next) {
        limit = limit + elements_per_page;
        table.empty();
        goFun(next, limit);
        addToggleModalTCEvents();
      }
    });

    $('#PreeValueTC').click(function () {
      var pre = limit - (2 * elements_per_page);
      if (pre >= 0) {
        limit = limit - elements_per_page;
        table.empty();
        goFun(pre, limit);
        addToggleModalTCEvents();
      }
    });

    addToggleModalTCEvents();
  }
}

$(document).ready(function () {
  testSuiteTableDynamics();

  search_components.forEach(item => {
    item.addEventListener('change', function (event) {
      searchTestSuite(search_components);
    });
  });

  window.onclick = function (event) {
    if (event.target == modal) {
      if (modalTC.style.display != "none") {
        modalTC.style.display = "none";
        $("#modalDataTestCaseDetails").get(0).innerHTML = "";
      }
      else if (modal.style.display != "none") {
        modal.style.display = "none";
        $('#testCaseTable').empty();
      }

    }
  }

  window.onkeydown = function (event) {
    if (event.keyCode == 27) {
      if (modalTC.style.display != "none") {
        modalTC.style.display = "none";
        $("#modalDataTestCaseDetails").get(0).innerHTML = "";
      }
      else if (modal.style.display != "none") {
        modal.style.display = "none";
        $('#testCaseTable').empty();
      }
    }
  }
});
