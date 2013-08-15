var serverFile='http://192.168.1.70/carlos/APPS/mitierraoaxaca/Web/fnc/ajaxfnc2.php';
//Mostrar Meseros
    function showMeseros(){
        $.ajax({
            type: 'POST',
            url: serverFile,
            data: 'fnc=showMeseros',
            error: function(xhr, type){
                alert('Ajax error!');
            }
        }).done(function(meseros){
            meseros=JSON.parse(meseros);
            for(i=0;i<meseros.length;i++){
                $('#meseros ul').append('<li class="opt" rel="'+meseros[i].meseroId+'">'+meseros[i].Nombre+'</li>');
            }
        });
    }
//Mostrar Mesas
    function showTables(){
        $.ajax({
            type: 'POST',
            url: serverFile,
            data: 'fnc=showTables',
            error: function(xhr, type){
                alert('Ajax error!');
            }
        }).done(function(tables){
            tables=JSON.parse(tables);
            //navigator.notification.alert(tables[0],null,'tit','btn');
            $('#options select').html('');
            $('#options select').append('<option value="">Abrir Mesa</option>');
            for(i=0;i<tables.length;i++){
                $('#options select').append('<option value="'+tables[i].mesaId+'">Mesa '+tables[i].mesaId+'</option>');
            }
        });
    }
//Mostrar Mesas Abiertas
    function showOpenedTables(){
        $.ajax({
            type: 'POST',
            url: serverFile,
            data: 'fnc=openedTables',
            error: function(xhr, type){
                alert('Ajax error!');
            }
        }).done(function(tables){
            tables=JSON.parse(tables);
            for(i=0;i<tables.length;i++){//Listar
                //checar si existe la mesa en la lista
                var b=0;
                $('#tables li').each(function(){
                    if($(this).attr('id')=='tab'+tables[i].mesaId)
                        b=1;
                });
                if(b==0){//Obtenemos mesas abiertas sin listar
                    clase = '';
                    if(tables[i].stat==0)
                        clase = 'class="pending"';
                    $('#tables').append('<li id="tab'+tables[i].mesaId+'" '+clase+' orden="'+tables[i].ordenId+'">Mesa '+tables[i].mesaId+'</li>');
                }
            }
            $('#tables li').each(function(){//Deslistar
                var s=0;
                for(i=0;i<tables.length;i++){
                    if($(this).attr('id')=='tab'+tables[i].mesaId)
                        s=1;
                }
                if(s==0)
                    $(this).remove();
            });
        });
    }
//Abrir Mesas
    function openTable(id){
        //Crear Nueva Orden
        $.ajax({
            type: 'POST',
            url: serverFile,
            data: 'fnc=openTable&id='+id,
            error: function(xhr, type){
                alert('Ajax error!');
            }
        }).done(function(orden){
            if(orden>0){
                $('#tables').append('<li id="tab'+id+'" orden="'+orden+'">Mesa '+id+'</li>');
            }
        });
    }
//Obtener Pedidos de la Orden
    function getPedidosOrden(oId){
        $.ajax({
            type: 'POST',
            url: serverFile,
            data: 'fnc=getPedidosOrden&id='+oId,
            error: function(xhr, type){
                alert('Ajax error!');
            }
        }).done(function(pedidos){
            pedidos=JSON.parse(pedidos);
            for(i=0;i<pedidos.length;i++){
                if(pedidos[i].entrega=='00:00:00')
                    putPedidoPendiente(pedidos[i].pedidoId,pedidos[i].prodId,pedidos[i].producto,pedidos[i].precio,pedidos[i].tipoId);
                else
                    putPedidoEntregado(pedidos[i].prodId,pedidos[i].producto,pedidos[i].precio);
            }
        });
    }
//Mostrar Menú
    function showMenu(){
        $.ajax({
            type: 'POST',
            url: serverFile,
            data: 'fnc=getMenu',
            error: function(xhr, type){
                alert('Ajax error!');
            }
        }).done(function(menu){
            menu=JSON.parse(menu);
            for(i=0;i<menu.length;i++){
                var ul = $('#orden .carta').children('ul.tipo'+menu[i].tipoId);
                ul.append('<li class="option" rel="'+menu[i].prodId+'"><span class="des">'+menu[i].producto+'</span><span class="precio">'+menu[i].precio+'</span></li>');
            }
        });
    }
//Hacer Pedido de Orden
    function hacerPedido(obj){
        $.ajax({
            type: 'POST',
            url: serverFile,
            data: 'fnc=setPedido&oid='+$('#orden').attr('orden')+'&pid='+obj.attr('rel'),
            error: function(xhr, type){
                alert('Ajax error!');
            }
        }).done(function(done){
            if(done>0){
                putPedidoPendiente(done,obj.attr('rel'),obj.children('.des').text(),obj.children('.precio').text(),(obj.parent('ul').attr('class')).substr(4));
                navigator.notification.alert('Ha Seleccionado: '+obj.children('.des').text(),null,'Satisfactorio','Aceptar');
            }else{
                navigator.notification.alert('Error al solicitar el Pedido '+done,null,'Error','Aceptar');
            }
        });
    }
//Entregar Pedido
    function entregarPedido(obj){
        $.ajax({
            type: 'POST',
            url: serverFile,
            data: 'fnc=entregarPedido&pid='+obj.attr('pedido'),
            error: function(xhr, type){
                alert('Ajax error!');
            }
        }).done(function(done){
            if(done==1){
                putPedidoEntregado((obj.attr('id')).substr(4),obj.text(),obj.attr('precio'));
                obj.remove();
            }else{
                navigator.notification.alert('Error al entregar el Pedido',null,'Error','Aceptar');
            }
        });
    }
//Cerrar Mesa
    function closeTable(){
        $.ajax({
            type: 'POST',
            url: serverFile,
            data: 'fnc=setCaja&oid='+$('#orden').attr('orden'),
            error: function(xhr, type){
                alert('Ajax error!');
            }
        }).done(function(done){
            if(done==1){
                $('#tables li[orden='+$('#orden').attr('orden')+']').remove();
                $('#orden').hide();$('#home').show();
            }else{
                navigator.notification.alert('Error al cerrar la Mesa',null,'Error','Aceptar');
            }
        });
    }