angular.module('pipedriveCars').controller('CrudCarController',['$filter','$scope', function($filter,$scope) {

    var cars = [
        {
            id    : 1,
            user  : 22,
            model : 'Ford Focus',
            year  : 2012,
            color : 'Branco'
        },{
            id    : 2,
            user  : 19,
            model : 'Fiat Palio',
            year  : 2006,
            color : 'Preto'
        },{
            id    : 3,
            user  : 26,
            model : 'Volkswagen Jetta',
            year  : 2017,
            color : 'Verde'
        },{
            id    : 4,
            user  : 19,
            model : 'Chevrolet Cruze',
            year  : 2010,
            color : 'Verde'
        },{
            id    : 5,
            user  : 26,
            model : 'Citroen C3',
            year  : 2001,
            color : 'Preto'
        }
    ];

    var users = [
        {
            id   : 22,
            name : 'Luiz'
        },
        {
           id   : 19,
           name : 'Lucas'
        },
        {
           id   : 26,
           name : 'Diego'
        },
    ];

    var token = {
        id   : 'A123AAS4142C1239AODS13',
        cars : cars,
        users: users
    };

    $scope.titleForm = "Novo Carro";
    $scope.carId = 0;

    /* PROCURA TOKEN */
    $scope.searchToken = function (form) {
        var testToken = angular.lowercase($scope.tokenPipedrive);
        token.id = angular.lowercase(token.id);

        if(testToken === token.id){
            $scope.showInformativeText = true;
            $scope.classMain = "visible";
            $scope.cars = token.cars;
            $scope.users = token.users;

        }else{
            $scope.showInformativeText = false;
            $scope.classMain = "";
            var formId = form.$name;
            abreAlert("Token invádio, tente novamente!");
        }
    }

    /* EDITA ITEM NA LISTA */
    $scope.editItem = function(id){
        var car = returnItemCars(id);

        if(car.model){
            var user = returnItemUsers(car.user);

            $scope.newCarModel = car.model;
            $scope.newCarYear = car.year;
            $scope.newCarColor = car.color;
            $scope.newCarUser = user;

            $scope.carIndex = token.cars.map(function(item) { 
                return item.id;
            }).indexOf(car.id);

            $scope.carId = car.id;

            $scope.classFormEdit = 'new-item--edit';
            $scope.titleForm = "Editar Carro";
        }
    };

    /* ADICIONA ITEM NA LISTA */
    $scope.addCarItem = function(form) {

        var validateYear = function(){
            var calcYear = parseInt(new Date().getFullYear()) - parseInt($scope.newCarYear);

            if(calcYear < 30){
                return true;
            }else{
                return false;
            }
        };

        var isInArray = function(value, array) {
            return array.indexOf(value) > -1;
        }

        var allowedColors = ['branco','preto','verde'];

        if($scope.newCarUser && $scope.newCarModel && 
            $scope.newCarYear && $scope.newCarColor) {

            if(!validateYear()){
                abreAlert("Para cadastrar um carro, o mesmo não pode ter mais de 30 anos, tente novamente!");
           
            }else if(!isInArray(angular.lowercase($scope.newCarColor), allowedColors)){
                abreAlert("Para cadastrar um carro, somente são permitidas as cores Branco, Preto e Verde. Tente novamente!");

            }else{
                var arrayId = token.cars.map(function(item) { 
                    return item.id;
                });

                var edit = isInArray($scope.carId, arrayId);

                if(!edit){
                    var newId = 0;
                    if(token.cars.length > 0){
                        newId = parseInt(token.cars[token.cars.length - 1].id);
                    }
                    newId++;

                    var getUser = $scope.newCarUser;
                    token.cars.push({
                        id    : newId,
                        user  : getUser.id,
                        model : $scope.newCarModel,
                        year  : $scope.newCarYear,
                        color : $scope.newCarColor
                    });

                }else{
                    var getUser = $scope.newCarUser;
                    token.cars[$scope.carIndex].user = getUser.id;
                    token.cars[$scope.carIndex].model = $scope.newCarModel;
                    token.cars[$scope.carIndex].year = $scope.newCarYear;
                    token.cars[$scope.carIndex].color = $scope.newCarColor;
                }

                $scope.resetForm();
            }

        }else{
            var formId = form.$name;
            if(form.$error.maxlength){
                abreAlert("Máximo de caracteres excedidos, tente novamente!");
            
            }else if(form.$error.minlength){
                abreAlert("Mínimo de caracteres necessários para prosseguir, tente novamente!");
           
            }else{
                abreAlert("Para prosseguir preencha todos os campos!");
            }  
        }
    };

    $scope.resetForm = function(){
        $scope.newCarModel = '';
        $scope.newCarYear = '';
        $scope.newCarColor = '';
        $scope.newCarUser = '';
        $scope.carId = 0;
        $scope.carIndex = -1;
        $scope.classFormEdit = '';
        $scope.titleForm = "Novo Carro";

        var items = document.querySelectorAll('.result-list__item');
        [].forEach.call(items, function(el) {
            el.classList.remove('active');
        });
    };

    /* REMOVE ITEM NA LISTA */
    removeCar = function(item){
        token.cars.splice(item, 1);
        $scope.resetForm();
    };

    /* ABRE MODAL */
    $scope.mostraModal = false;
    $scope.tarefaModal, 
    $scope.itemModal = "";
    $scope.abreModal = function(form){
        var item = form.indexCar.$viewValue;
        var tarefa = token.cars[item].model;
        $scope.tarefaModal  = tarefa;
        $scope.itemModal    = item;
        $scope.mostraModal  = !$scope.mostraModal;
    };

    /* ABRE ALERT */
    $scope.mostraAlert = false;
    $scope.tipoAlert = "";
    abreAlert = function(item, id){
        $scope.tipoAlert    = item;
        $scope.formAlert    = id;
        $scope.mostraAlert  = !$scope.mostraModal;
    };

    /* RETORNA CARRO ESPECIFICO */
    returnItemCars = function(id){
        return $filter('filter')(token.cars, function (d) {
            return d.id === id;
        })[0];
    };

    /* RETORNA USUARIO ESPECIFICO */
    returnItemUsers = function(id){
        return $filter('filter')(token.users, function (d) {
            return d.id === id;
        })[0];
    };
}]);    