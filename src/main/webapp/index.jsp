<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

	<!--<script type="text/javascript" src="node_modules/ibm-mfp-web-sdk/ibmmfpfanalytics.js"></script>
    <script type="text/javascript" src="node_modules/ibm-mfp-web-sdk/ibmmfpf.js"></script>
	<script type="text/javascript" src="index.js"></script>-->
	<link rel="stylesheet" type="text/css" href="css/index.css" />
	<link rel="stylesheet" href="node_modules/tabulator-tables/dist/css/tabulator.min.css">
	<link rel="stylesheet" type="text/css" href="js/popupS/css/popupS.min.css">
	<!--<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">-->
	<link rel="stylesheet" href="js/bootstrap-3.3.7/dist/css/bootstrap.min.css">
	<!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">-->

	<!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="node_modules/jquery/dist/jquery.min.js"></script>
	<script type="text/javascript" src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>-->
	<script type="text/javascript" src="node_modules/tabulator-tables/dist/js/tabulator.min.js"></script>
	<script type="text/javascript" src="js/jquery-3.3.1/jquery-3.3.1.min.js"></script>
	<script type="text/javascript" src="js/bootstrap-3.3.7/dist/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/sweetalert/sweetalert.min.js"></script>

	<script type="text/javascript" src="node_modules/requirejs/require.js" data-main="js/index"></script>
</head>

<body>
	<div id="main" style="overflow-y: auto;">
		<div id="navbar" style="display: none;">
			<!--	<p class="label" id="resultLabel"></p>-->
			<nav class="navbar bg-info">
				<div class="container-fluid">
					<div class="navbar-header">
						<a class="navbar-brand">
							<img alt="Brand" src="images/mfp-icon.png" style="width:25px;">
						</a>
					</div>
					<div class="nav navbar-nav">
						<a id="pushTittle" class="navbar-brand" href="#">
						</a>
					</div>
					<ul class="nav navbar-nav">
						<li class="active"><a id="status_mfp"><span class="dot" id="dot"></span></a></li>
					</ul>
					<ul class="nav navbar-nav">
						<li class="active"><a href="#" id="adminLink">Admin</a></li>
					</ul>
					<ul class="nav navbar-nav navbar-right">
						<!--<li><a href="#"><span class="glyphicon glyphicon-log-out"></span> Logout </a></li>-->

						<li class="nav-item dropdown">
							<a id="displayName" class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
							 aria-haspopup="true" aria-expanded="false">
								<!--<span class="glyphicon glyphicon-cog"></span>
								Hola, Carlos-->
							</a>
							<ul class="dropdown-menu">
								<li><a id="logout" href="#">
										<!--<span class="glyphicon glyphicon-log-out"></span>
									Logout --></a></li>
							</ul>
						</li>
					</ul>
				</div>
			</nav>
		</div>
		<div id="protectedDiv" style="display: none;">
			<!-- Modal Loading-->
			<div class="modal fade" id="loadMe" tabindex="-1" role="dialog" aria-labelledby="loadMeLabel">
				<div class="modal-dialog modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-body text-center">
							<div class="loader"></div>
							<div clas="loader-txt">
								<p id="loadingApps"></p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div id="main_content">
				<!--<div class="popover">
					<ul class="nav nav-pills nav-stacked" role="tablist">
						<li role="presentation"><a id="sendbydevice" role="tab" data-toggle="tab" href="#">Send by Device</a></li>
					</ul>
				</div>-->
				<div id="example-table"></div>
				<!--<div id="devices-table"></div>-->
			</div>

			<!-- Modal -->
			<div class="modal fade" id="myModal" role="dialog">
				<div class="modal-dialog">

					<!-- Modal content-->
					<div class="modal-content">
						<div class="modal-header" style="padding:25px 40px;">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4><span class="glyphicon glyphicon-lock"></span>Push</h4>
						</div>
						<div class="modal-body" style="padding:40px 50px;">
							<form data-toggle="validator" role="form">
								<div class="form-group">
									<label id="labelDevices" for="devices">
										<!--<span class="glyphicon glyphicon-phone"></span> Devices--></label>
									<input id="devices" type="text" class="form-control" readonly="true" required></input>
								</div>
								<div class="alert alert-warning" id="alertDevices">
									<!--<strong>Advertencia!</strong> No existen dispositivos registrados.-->
								</div>
								<div class="form-group">
									<label id="labelUsrname" for="usrname">
										<!--<span class="glyphicon glyphicon-user"></span> ID--></label>
									<input type="text" class="form-control" id="usrname" required>
								</div>
								<div class="form-group">
									<label id="labelPsw" for="psw">
										<!--<span class="glyphicon glyphicon-eye-open"></span> Credencial--></label>
									<input type="password" class="form-control" id="psw" required>
								</div>
								<div class="form-group">
									<label id="labelMsj" for="msj">
										<!--<span class="glyphicon glyphicon-align-left"></span> Mensaje--></label>
									<input type="text" class="form-control" id="msj" required>
								</div>
								<div class="form-group">
									<div class="input-group" id="sendTo">
										<div class="input-group-btn">
											<button id="btnSendTo" type="button" class="btn dropdown-toggle" data-toggle="dropdown">
												<!--Enviar a: <span class="caret"></span>-->
											</button>
											<ul id="appslist" class="dropdown-menu">
											</ul>
										</div>
										<input type="TextBox" id="appsbox" Class="form-control" readonly="true" required />
									</div>
								</div>
								<div class="form-group">
									<button id="getToken" class="btn btn-info btn-block" data-loading-text="Enviando...">
										<span class="glyphicon glyphicon-send"></span>
										Enviar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div class="container" style="display: none;">
				<hr />
				<div id="one" style="overflow-y: auto;">
					<ul id="nav-pills" class="nav nav-pills nav-stacked" role="tablist"></ul>
				</div>
				<div id="two" class="tab-content" style="display: none;">
					<div>
						<div>
							<h4>Push</h4>
						</div>
						<div>
							<form data-toggle="validator" role="form">
								<div class="form-group">
									<label for="usrname"><span class="glyphicon glyphicon-user"></span> ID</label>
									<input type="text" class="form-control" placeholder="Ingrese el ID" required>
								</div>
								<div class="form-group">
									<label for="psw"><span class="glyphicon glyphicon-eye-open"></span> Credencial</label>
									<input type="password" class="form-control" placeholder="Ingrese la credencial" required>
								</div>
								<div class="form-group">
									<label for="msj"><span class="glyphicon glyphicon-align-left"></span> Mensaje</label>
									<input type="text" class="form-control" placeholder="Mensaje..." required>
								</div>
								<div class="form-group">
									<div class="input-group">
										<div class="input-group-btn">
											<button type="button" class="btn dropdown-toggle" data-toggle="dropdown">
												Enviar a: <span class="caret"></span>
											</button>
											<ul id="appslist2" class="dropdown-menu">
											</ul>
										</div>
										<input id="appsbox2" type="TextBox" Class="form-control" readonly="true" required />
									</div>
								</div>
								<div class="form-group">
									<button class="btn btn-info" data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Enviando..."><span
										 class="glyphicon glyphicon-send"></span>
										Enviar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>

		</div>
		<div id="adminDiv" style="display: none;">
			<iframe src="admin.jsp" name="iframe_admin" style="border: none;"></iframe>
		</div>
	</div>

	<!-- Login -->
	<div id="loginDiv" class="loginDiv bg-info" style="display: none;">
		<div>
			<img alt="Brand" src="images/mfp-icon.png" width="40px">
		</div>
		<div id="main_title"></div>
		<br />
		<p><span class="glyphicon glyphicon-lock"></span></p>
		<p id="usernamep" class="loginTxt"></p>
		<input type="text" class="loginInput" autocapitalize="off" autocorrect="off" id="username" />
		<br />
		<br />
		<p id="passwordp" class="loginTxt"></p>
		<input type="password" class="loginInput" id="password" />
		<br />
		<p id="rememberMeText" class="loginTxt">
			<!--Remember me
			<input type="checkbox" id="rememberMe" class="loginInput" />-->
		</p>
		<br clear="all" />
		<button id="login" class="btn btn-info"></button>
		<br />
		<p class="loginTxt" id="statusMsg"></p>
	</div>
</body>

</html>