// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
	function processFiles(files) {
		var file = files[0];

		var reader = new FileReader();

		reader.onload = function (e) {
			var result = e.target.result.replace(/\//g, '|')
			.replace(/\�/g, ',').replace(/\"/g, ',');
			$("#fileOutput").html(result);
			var t = createObj(result);
			createTables(t);
		};
		reader.readAsText(file, 'UTF-8');
	}
} else {
  alert('The File APIs are not fully supported in this browser.');
}

//Crea objeto
function createObj(data) {
	var result = new Array();
	result.Departamentos = new Array();
  	data.split(/\,/).forEach(function(el){
  		var ld = 0;
		var lp = 0;
		var lds = 0;
		var dep = "";
		var pro = "";
		var dis = "";
		el= el.replace(/\r?\n/g, "");
  		if (el !== ""){
  			dep = el.trim().split(/\|/)[0].trim();
  			pro = el.trim().split(/\|/)[1].trim();
  			dis = el.trim().split(/\|/)[2].trim();
  			depPart = [dep.substr(0,dep.trim().indexOf(' ')), dep.trim().substr(dep.indexOf(' ')+1)];
  			proPart = [pro.substr(0,pro.trim().indexOf(' ')), pro.trim().substr(pro.indexOf(' ')+1)];
  			disPart = [dis.substr(0,dis.trim().indexOf(' ')), dis.trim().substr(dis.indexOf(' ')+1)];
  			if (dep !== "" && search(result.Departamentos, depPart[0], -1, -1) !== 1){
  				ld =  result.Departamentos.length;
  				result.Departamentos[ld] = new Object();
  				result.Departamentos[ld].Departamento = createDep(depPart);
  			}
  			if (pro !== "" && search(result.Departamentos, depPart[0], proPart[0], -1) !== 1){
  				$.each(result.Departamentos, function(i, v){
					if (v.Departamento.Codigo === depPart[0]){
						lp = v.Departamento.Provincias.length;
						v.Departamento.Provincias[lp] = new Object();
						v.Departamento.Provincias[lp].Provincia = createPro(proPart);
					}
  				});
  			}
  			if (dis !== "" && search(result.Departamentos, depPart[0], proPart[0], disPart[0]) !== 1){
  				$.each(result.Departamentos, function(i, v){
  					if(v.Departamento.Codigo === depPart[0]){
  						$.each(v.Departamento.Provincias, function(k,s){
  							if (s.Provincia.Codigo === proPart[0]){
  								lds = s.Provincia.Distritos.length;
  								s.Provincia.Distritos[lds] = new Object();
  								s.Provincia.Distritos[lds].Distrito = createDis(disPart);
  							}
  						});
  					}
  				});
  			}
  		}
  	});
  	return result;
}

//Crea un departamento
function createDep(p){
	var dp = new Object();
	dp.Codigo = p[0];
	dp.Descripcion = p[1];
	dp.Provincias = new Array();
	return dp;
}

//Crea una provincia
function createPro(p){
	var pro =  new Object();
	pro.Codigo = p[0];
	pro.Descripcion = p[1];
	pro.Distritos = new Array();
	return pro;
}

//Crea un distrito
function createDis(d){
	var dt = new Object();
	dt.Codigo = d[0];
	dt.Descripcion = d[1];
	return dt;
}

//Busca si ya existe un elemento en un listado dado
function search(universe, d, p, dis){
	var con = 0;
	if (universe.length > 0){
		$.each(universe, function (i, v){
			if (v.Departamento.Codigo === d) {
				if (p === -1){
					con = 1;
				} else if (v.Departamento.Provincias.length > 0){
					$.each(v.Departamento.Provincias, function(k, e){
						if (e.Provincia.Codigo === p){
							if (dis === -1){
								con = 1;
							} else if (e.Provincia.Distritos.length > 0){
								$.each(e.Provincia.Distritos, function(t, u){
									if (u.Distrito.Codigo === dis){
										con = 1;
									}
								});
							}
						}
					});
				}
			}
		});
	}

	return con;
}

//Crea las tablas 
function createTables(objSer){
	$("#original").toggleClass("hideTables showTables");
	$("#tables").toggleClass("hideTables showTables");
	$.each(objSer.Departamentos, function(i, v){
		$("#Departamentos > tbody").append('<tr><td>'+
			v.Departamento.Codigo+
			'</td><td>'+
			v.Departamento.Descripcion +
			'</td><td>-</td><td>-</td></tr>');

		$.each(v.Departamento.Provincias, function(k, s){
			$("#Provincias > tbody").append('<tr><td>'+
			s.Provincia.Codigo+
			'</td><td>'+
			s.Provincia.Descripcion +
			'</td><td>'+
			v.Departamento.Codigo +
			'</td><td>'+
			v.Departamento.Descripcion +
			'</td></tr>');
			$.each(s.Provincia.Distritos, function(i, j){
				$("#Distritos > tbody").append('<tr><td>'+
				j.Distrito.Codigo+
				'</td><td>'+
				j.Distrito.Descripcion +
				'</td><td>'+
				s.Provincia.Codigo +
				'</td><td>'+
				s.Provincia.Descripcion +
				'</td></tr>');
			});
		});
	});
}