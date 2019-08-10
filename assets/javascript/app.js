var i = 0;//firebase 

 var firebaseConfig = {
  apiKey: "AIzaSyDIqPnRluarxcdq1KNy-zsAqZP8qxHa8D4",
  authDomain: "train-scheduler-4ad55.firebaseapp.com",
  databaseURL: "https://train-scheduler-4ad55.firebaseio.com",
  projectId: "train-scheduler-4ad55",
  storageBucket: "train-scheduler-4ad55.appspot.com",
  messagingSenderId: "426620010801",
  appId: "1:426620010801:web:998eab4df1b93f66"
};
firebase.initializeApp(firebaseConfig);


var database = firebase.database();

$("#form-information").on("submit", function (event) {
    event.preventDefault();

    var name = $("#train-name").val().trim();
    var destination = $("#train-destination").val().trim();
    var firstTime = $("#train-time").val().trim();
    var frequency = $("#frequency").val().trim();

    database.ref().push({
      name: name,
      destination: destination,
      firstTime: firstTime,
      frequency: frequency
    });

    $("#train-name").val("");
    $("#train-destination").val("");
    $("#train-time").val("");
    $("#frequency").val("");

    return false;
  });

database.ref().orderByChild("dateAdded").on("child_added", function (childSnapshot) {

  var addButton = $("<button>").html("<span class='glyphicon glyphicon-edit'></span>").addClass("button-update").attr("data-i", i).attr("data-key", childSnapshot.key);
  var remove = $("<button>").html("<span class='glyphicon glyphicon-remove'></span>").addClass("remove-button").attr("data-i", i).attr("data-key", childSnapshot.key);

  var firstTime = childSnapshot.val().firstTime;
  var currentFre = parseInt(childSnapshot.val().frequency);
  var trainNum = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(trainNum);
  console.log(firstTime);
  var currT = moment();
  var timeCal = moment().subtract(1, "years");
  var diffTime = moment().diff(moment(trainNum), "minutes");
  var tRemainder = diffTime%currentFre;
  var minCount = currentFre - tRemainder;
  var nextTrain = moment().add(minCount, "minutes").format ("hh:mm A");
  var btime = moment(trainNum).diff(timeCal, "minutes");
  var bmin = Math.ceil(moment.duration(btime).asMinutes());

  if ((timeCal - trainNum) < 0) {
    nextTrain = childSnapshot.val().firstTime;
    console.log("Before First Train");
    minCount = bmin;
  }
  else {
    nextTrain = moment().add(minCount, "minutes").format("hh:mm A");
    minCount = currentFre - tRemainder;
    // console.log("here");
  }


  var newRow = $("<tr>");
  newRow.addClass("row-" + i);
  var cell1 = $("<td>").append(addButton);
  var cell2 = $("<td>").text(childSnapshot.val().name);
  var cell3 = $("<td>").text(childSnapshot.val().destination);
  var cell4 = $("<td>").text(childSnapshot.val().frequency);
  var cell5 = $("<td>").text(nextTrain);
  var cell6 = $("<td>").text(minCount);
  var cell7 = $("<td>").append(remove);

  newRow
    .append(cell1)
    .append(cell2)
    .append(cell3)
    .append(cell4)
    .append(cell5)
    .append(cell6)
    .append(cell7);

 $("#tableContent").append(newRow);

 i++;
  
}, function (error) {

  alert(error.code);

});

function deleteRow () {
  $(".row-" + $(this).attr("data-i")).remove();
  database.ref().child($(this).attr("data-key")).remove();
};

function changeRow () {
  $(".row-" + $(this).attr("data-i")).children().eq(1).html("<textarea class='newTrain'></textarea>");
  $(".row-" + $(this).attr("data-i")).children().eq(2).html("<textarea class='newDestination'></textarea>");
  $(".row-" + $(this).attr("data-i")).children().eq(3).html("<textarea class='newFrequency' type='number'></textarea>");
  $(this).toggleClass("button-update").toggleClass("submitButton");
};

function createRow () {
  var newTrain = $(".newTrain").val().trim();
  var newDestination = $(".newDestination").val().trim();
  var newFrequency = $(".newFrequency").val().trim();

  database.ref().child($(this).attr("data-key")).child("name").set(newTrain);
  database.ref().child($(this).attr("data-key")).child("destination").set(newDestination);
  database.ref().child($(this).attr("data-key")).child("frequency").set(newFrequency);

  $(".row-" + $(this).attr("data-i")).children().eq(1).html(newTrain);
  $(".row-" + $(this).attr("data-i")).children().eq(2).html(newDestination);
  $(".row-" + $(this).attr("data-i")).children().eq(3).html(newFrequency);
  $(this).toggleClass("button-update").toggleClass("submitButton");
};

$(document).on("click", ".remove-button", deleteRow);
$(document).on("click", ".button-update", changeRow);
$(document).on("click", ".submitButton", createRow);