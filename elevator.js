{
    init: function (elevators, floors) {
        var elevatorsCount = elevators.length;

        for (i=0; i < elevatorsCount; i++) {
            let elevator = elevators[i];

            elevator.on("idle", function() {
                let currentFloor = elevator.currentFloor();
                let allPressedFloorButtons = elevator.getPressedFloors(); //inside
                let firstPressedFloorButton = elevator.getFirstPressedFloor(); //inside
                let load = elevator.loadFactor();

                if (load > 0.1) {
                    if (Array.isArray(allPressedFloorButtons) && allPressedFloorButtons.length > 0) {
                        let temp = [];

                        allPressedFloorButtons.forEach((value, index) => {
                            let diff = Math.abs(currentFloor-allPressedFloorButtons[index]);
                            temp[diff] = index;
                        });

                        temp.sort();
                        temp.forEach((diff, index) => {
                            elevator.goToFloor(allPressedFloorButtons[index]);
                        })
                    }
                } else {
                    elevator.goToFloor(firstPressedFloorButton);
                }
            })

            for (fl = 0; fl < floors.length; fl++) {
                let floor = floors[fl];

                if (elevator.loadFactor() < 0.2) {
                    floor.on("up_button_pressed", function() {
                        elevator.goToFloor(floor.level); 
                    });

                    floor.on("down_button_pressed", function() {
                        elevator.goToFloor(floor.level); 
                    });
                }
            }
        }
    },
    
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}