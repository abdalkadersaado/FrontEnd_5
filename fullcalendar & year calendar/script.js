var eventGlobal; 
var startDateGlobal;
var endDateGlobal;
var dragId;

document.addEventListener('DOMContentLoaded', function () { 

    /********* initialize the external events  *********/ 
    var containerEl = document.getElementById('external-events-list');
    new FullCalendar.Draggable(containerEl, {
        itemSelector: '.fc-event',
        eventData: function (eventEl) { 
            return {
                title: eventEl.innerText.trim(),
                stick: true, // maintain when user navigates (see docs on the renderEvent method)
                color: eventEl.getAttribute("data-color"),
                id: eventEl.getAttribute("id",)
            }
        },
    });

    var calendarEl = document.getElementById('calendar'); 
    var calendar = new FullCalendar.Calendar(calendarEl, { 
        locale: 'tr', 
        dayMaxEvents: true, // allow "more" link when too many events
        selectable: true,
        selectMirror: true,
        weekends: true,  // Hafta sonlarını gizlemek için false olarak değiştilebilir 
        businessHours: true, // display business hours
        allDaySlot: true, // tüm gün alanını gösterir 
        height: 700, 
        editable: true,
        eventDurationEditable: true,
        droppable: true, // this allows things to be dropped onto the calendar
        scrollTime: '08:00', 
        slotDuration: '00:30', // saat zaman aralıkları 
        slotLabelInterval: '00:30', 
        editable: true, 
        headerToolbar: {
            // virgül koyarsak ekranda birleşik gözükür boşluk bırakırsak ayrı ayrı gösterir.
            left: 'prevYear,prev,next,nextYear today', // today,
            center: 'title', // addEventButton Ay ismini göstermek için 
            right: 'year,dayGridMonth,timeGridWeek' // timeGridFourDay  ,denemeBtn,timeGridDay,listMonth
        },
        customButtons: {
            year: {
                text: 'Yıllık',
                click: function() { 
                    $("#firstCalendar").addClass("d-block").removeClass("d-none"); 
                    $('#secondCalendar').addClass('d-none').removeClass("d-block");   
                }
            },   
        }, 

        drop: function(element) {   
            let eventId = element.draggedEl.id;  
            let eventColor = element.draggedEl.dataset.color;
            let startDate = element.dateStr; 
            let endDate = element.dateStr;  
            saveYearEvent(eventId,startDate, endDate, eventColor);    
            changeDropEventsId(); 
        },  

        eventDrop: function (info) { 
            eventId = info.event.id; 
            startDate = info.event.startStr;
            endDate = info.event.endStr;
            //endDate =  info.event.endStr || startDate;

            if (endDate == "") {
                let splitStartDate = startDate.split("-"); 
                let arttir = parseInt(splitStartDate[2]) + 1 ;
                endDate = splitStartDate[0] + "-" + splitStartDate[1] + "-" + arttir; 
            }
            
            eventColor = info.event.backgroundColor;
            updateYearEvent(eventId, startDate, endDate, eventColor);  

            changeDropEventsId();
        }, 

        eventResize: function(info) { 
            eventId = info.event.id;
            startDate = info.event.startStr;
            endDate = info.event.endStr;
            eventColor = info.event.backgroundColor;
            updateYearEvent(eventId, startDate, endDate, eventColor);  
        },

        select: function (arg) { 
            $('#addModal').modal('show')  
            startDateGlobal = arg.startStr
            endDateGlobal = arg.endStr 
            calendar.unselect() 
        },  

        eventClick: function (info) { 
            $('#editModal').modal('show');  
            eventGlobal = info.event;   
        }, 

        events: [   
            { 
                id: 1,
                title: "Yıllık Tatil",
                start: '2021-01-05',
                end: '2021-01-07',
                color: '#235536',   
            },
            {   
                id: 2,
                title: "Ücretsiz İzin",
                start: '2021-01-01',
                end: '2021-01-04',
                color: '#e7515a', 
            },
            {   
                id: 3,
                title: "İşletme Tatili",
                start: '2021-01-20',
                end: '2021-01-24',
                color: '#e2a03f', 
            }, 

        ] 
    });

    calendar.render();  

    function changeDropEventsId() { 
        let elements = $(".changeId"); 
        let properties = Object.getOwnPropertyNames(elements);  
        var count = properties.length;
        elements.each((i, element) => { 
            $(element).prop("id", Math.floor(Math.random() * 999999) ); 
        }); 
    }

     $("#addNew").on('click', function (event) {  
        $("#formArea").toggleClass('d-block');
     });
    
     // select and Add new data 
    $("#addNewData").on('click', function (info) {  
        var eventColor = document.getElementById("event-color").value; 
        var eventTitle = jQuery("#event-color option:selected").text();

        var calendarEventCount = calendar.getEvents().length; 
        var lastEventId = calendar.getEvents()[calendarEventCount - 1].id;
        lastEventId++ 

        $('#addModal').modal('hide');
        let eventId = Math.floor(Math.random() * 9999);
        
        calendar.addEvent({
             id: lastEventId,
             title: eventTitle,
             start: startDateGlobal,
             end: endDateGlobal,  
             color: eventColor,
         }) 

        /*Yıllık takvime data gönderimi*/ 
        var newEndDay = new Date(endDateGlobal.valueOf());
        newEndDay.setDate(newEndDay.getDate() - 1);

        var month = (newEndDay.getMonth() + 1); // getMonth 0'den başladığı için 1 ekledik.
        var newEndDay2 = newEndDay.getFullYear() + "-" + (month < 10 ? '0' : '') + month + "-" + newEndDay.getDate();
        saveYearEvent(lastEventId, startDateGlobal, newEndDay2, eventColor);
    });

    $("#editData").on('click', function (info) {  
        var eventTitle = document.getElementById("event-title").value;
        var eventColor = document.getElementById("event-color").value;
        $('#editModal').modal('hide')

        calendar.addEvent({
            title: eventTitle,
            start: startDateGlobal,
            end: endDateGlobal, 
            color: eventColor,
        }) 
    });

    $("#deleteData").on('click', function (event) { 
        eventGlobal.remove();
        deleteYearEvent(eventGlobal.id);
    });


    $("#add-e").on('click', function (event) {    
        var inputStartDate = document.getElementById("start-date").value;
        var inputEndDate = document.getElementById("end-date").value;    
        var color = document.getElementById("color").value; 
        var eventTitle = jQuery("#color option:selected").text();

        var inputEndDate2 = new Date(inputEndDate.valueOf());
            inputEndDate2.setDate(inputEndDate2.getDate() + 1);   

        var month = (inputEndDate2.getMonth() + 1); // getMonth 0'den başladığı için 1 ekledik.
        var newEndDay = inputEndDate2.getFullYear() + "-" +  (month < 10 ? '0' : '') + month + "-" + (inputEndDate2.getDate() < 10 ? '0' : '') + inputEndDate2.getDate();
        var eventId = Math.floor(Math.random() * 9999);

        calendar.addEvent({   //  start: '2021-01-05',
            id: eventId,
            title: eventTitle,
            start: inputStartDate, 
            end: newEndDay,
            color: color,  
        });  

        saveYearEvent(eventId, inputStartDate, inputEndDate, color);
    });


    function saveYearEvent(eventId, inputStartDate, inputEndDate, color ) {  
        let splitStartDate = inputStartDate.split("-");
        let splitEndDate = inputEndDate.split("-");  
      
        //let startDateFormat = splitStartDate[0] + "," + splitStartDate[1] + "," + splitStartDate[2]; 
        let startDay = splitStartDate[2]; 
        let startMonth = ( (splitStartDate[1] -1) < 10 ? '0' : '') + (splitStartDate[1] - 1); // 0'dan başlıyor
        let startYear = splitStartDate[0]; 
      
        //let endDateFormat = splitEndDate[0] + "," + splitEndDate[1] + "," + splitEndDate[2];  
        var eventId = parseInt(eventId); 
       
        let endDay = splitEndDate[2]; 
        let endMonth = ( (splitEndDate[1] -1) < 10 ? '0' : '') + (splitEndDate[1] - 1); 
        let endYear = splitEndDate[0]; 

  /*   startDate: new Date(2021, 03, 05),  endDate: new Date(2021, 03, 08), */ 
          
        var event = { 
          id: eventId, 
          startDate: new Date(startYear, startMonth, startDay),
          endDate:   new Date(endYear, endMonth, endDay),  
          color: color,
        } 
                       

        var dataSource = secondCalendar.getDataSource();   
        dataSource.push(event);
        secondCalendar.setDataSource(dataSource); 

    }

    function updateYearEvent(eventId, inputStartDate, inputEndDate, color) { 
         
        let splitStartDate = inputStartDate.split("-");
        let splitEndDate = inputEndDate.split("-"); 
        //let startDateFormat = splitStartDate[0] + "," + splitStartDate[1] + "," + splitStartDate[2];
        
        let startDay = splitStartDate[2]; 
        let startMonth = ( (splitStartDate[1] -1) < 10 ? '0' : '') + (splitStartDate[1] - 1); // 0'dan başlıyor
        let startYear = splitStartDate[0]; 
      
       // let endDateFormat = splitEndDate[0] + "," + splitEndDate[1] + "," + (parseInt(splitEndDate[2]) - 1); 
        
        let endDay = ( (splitEndDate[2] -1) < 10 ? '0' : '') + (splitEndDate[2] - 1); 
        let endMonth = ( (splitEndDate[1] -1) < 10 ? '0' : '') + (splitEndDate[1] - 1); 
        let endYear = splitEndDate[0]; 
      
        var eventId = parseInt(eventId);
      
        var event = {
            id: eventId, 
            startDate: new Date(startYear, startMonth, startDay),
            endDate:   new Date(endYear, endMonth, endDay),  
            color: color,
        }  

        var dataSource = secondCalendar.getDataSource();  
        if (event.id) { 
            for (var i in dataSource) {  
                if (dataSource[i].id == event.id) {  
                    dataSource[i].startDate = event.startDate;
                    dataSource[i].endDate = event.endDate;
                    dataSource[i].color = event.color;
                }
            }
        }  
        secondCalendar.setDataSource(dataSource);
    }

    function deleteYearEvent(eventId) {  
        var dataSource = secondCalendar.getDataSource(); 
        var index;
        for (var i in dataSource) { 
            if (dataSource[i].id == eventId) {
                 index = i;
            }
        }  
        dataSource.splice(index, 1); 
        secondCalendar.render(); 
    }

const currentYear = new Date().getFullYear(); 

// Initialize calendar
let secondCalendar = new Calendar('#fullCalendar', {
    //style: 'background',
    dataSource: [
        {   
            id: 1,
            startDate: new Date(2021, 00, 05), 
            endDate: new Date(2021, 00, 06),
            color: '#235536',
        },
        { 
            id: 2,
            startDate: new Date(2021, 00, 01), 
            endDate: new Date(2021, 00, 03),
            color: '#e7515a',
        }, 
        {
            id: 3,
            startDate: new Date(2021, 00, 20),
            endDate: new Date(2021, 00, 23),
            color: '#e2a03f',
        },  
      
        {
              id: 4,
              startDate: new Date(2021, 01, 02),
              endDate: new Date(2021, 01, 03),
              color: '#e2a03f',
        },  
        { 
            id: 5,
            startDate: new Date(2021, 01, 20),
            endDate: new Date(2021, 01, 21),
            color: '#e2a03f',
        },  
    ],
    enableRangeSelection: true
});

secondCalendar.setLanguage("tr");

// Register events
document.querySelector('#fullCalendar').addEventListener('clickDay', function (e) { 
    let split = e.date.toLocaleDateString().split("."); 
    let month = split[2]  + "-" + split[1] + "-" + split[0]; 
    calendar.changeView('dayGridMonth', month); 
    $('#firstCalendar').addClass('d-none').removeClass("d-block");
    $("#secondCalendar").addClass("d-block").removeClass("d-none"); 

    calendar.render();  
})

});

