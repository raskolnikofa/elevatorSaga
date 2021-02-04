{
    init: function (elevators, floors) {
        var elevatorsCount = elevators.length;
        var floorsCount = floors.length;

        let groundFloor = 0;

        let prorityElevator = false;
        let prorityFloor = true;

        for (i=0; i < elevatorsCount; i++) {
            let elevator = elevators[i];
            
            // Event when elevator is empty
            elevator.on("idle", function() {
                elevator.goToFloor(groundFloor);
                elevator.goingUpIndicator(true)
                elevator.goingDownIndicator(true);
                proritazeFloors();
                checkFloors();
            });

            // Listen for the "floor_button_pressed" event, 
            // issued when a passenger pressed a button inside the elevator. 
            // This indicates that the passenger wants to go to that floor.
            elevator.on("floor_button_pressed", function(floor) {
                checkLoadFactor();

                if (prorityElevator == true) {
                    buildFloursQueue();
                } else {
                    checkFloors();
                }
            });


            // Elevator stopped at the floor
            elevator.on("stopped_at_floor", function(floor) {
                checkLoadFactor();

                if (prorityElevator == true) {
                    buildFloursQueue();
                } else {
                    checkFloors();
                }
            });


            function buildFloursQueue() {
                // double check of queue existense
                if (Array.isArray(elevator.getPressedFloors()) && elevator.getPressedFloors().length > 0) {
                        let temp = [];

                        // build queue
                        elevator.getPressedFloors().forEach((value, index) => {
                            let diff = Math.abs(elevator.currentFloor()-elevator.getPressedFloors()[index]);
                            if (temp.indexOf(diff) == '-1') {
                                temp[diff] = value;
                            } else {
                                temp[diff+1] = value;
                            }
                            
                        });

                        temp = temp.filter(item => item > -1);
                    
                        elevator.destinationQueue = temp;
                        elevator.checkDestinationQueue();
                } 
            }

            function configureIndicator(floor) {
                let destination = elevator.currentFloor() - floor;
                if (destination < 0) {
                    elevator.goingUpIndicator(true)
                    elevator.goingDownIndicator(false);
                } else {
                    elevator.goingDownIndicator(true);
                    elevator.goingUpIndicator(false);
                }
            }

            function checkLoadFactor() {
                if (elevator.loadFactor() > 0.3) {
                    proritazeElevator();
                } else {
                    proritazeFloors();
                }
            }

            function checkFloors() {
                for (fl = 0; fl < floorsCount; fl++) {
                let floor = floors[fl];
                
                    if (prorityFloor == true) {
                        // Listen for the "up_button_pressed" event, 
                        // issued when a passenger pressed the up button on the floor they are waiting on. 
                        // This indicates that the passenger wants to go to another floor.
                        floor.on("up_button_pressed", function() {
                            // configureIndicator(floor.level);
                            elevator.goToFloor(floor.level);
                        });

                        // Listen for the "down_button_pressed" event, 
                        floor.on("down_button_pressed", function() {
                            // configureIndicator(floor.level);
                            elevator.goToFloor(floor.level); 
                        });
                    }             
                }
            } 

            function proritazeFloors() {
                prorityFloor = true;
                prorityElevator = false;
            }

            function proritazeElevator() {
                prorityElevator = true;
                prorityFloor = false;
            }
        }
    },

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}