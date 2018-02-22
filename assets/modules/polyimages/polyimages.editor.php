<?php


	include_once(dirname(__FILE__)."/../../cache/siteManager.php");
	require_once(dirname(__FILE__).'/../../../'.MGR_DIR.'/includes/protect.inc.php');
	define('MODX_MANAGER_PATH', "../../../".MGR_DIR."/");
	require_once(MODX_MANAGER_PATH . 'includes/config.inc.php');
	require_once(MODX_MANAGER_PATH . '/includes/protect.inc.php');
	require_once(MODX_MANAGER_PATH.'/includes/document.parser.class.inc.php');

	session_name($site_sessionname);
	session_id($_COOKIE[session_name()]);
	if(!empty($_COOKIE[session_name()])) session_start();
	$modx = new DocumentParser;
	$modx->db->connect();
	$modx->getSettings();
	$modx->config['site_url'] = isset($request['site_url']) ? $request['site_url'] : '';

	if($_SESSION['mgrValidated']){
		define('IN_MANAGER_MODE', true);
		define('MODX_API_MODE', true);
	}

	if (IN_MANAGER_MODE != "true" || empty($modx) || !($modx instanceof DocumentParser)) {
		die("<b>INCLUDE_ORDERING_ERROR</b><br /><br />Please use the MODX Content Manager instead of accessing this file directly.");
	}

	if (!$modx->hasPermission('exec_module')) {
		header("location: " . $modx->getManagerPath() . "?a=106");
	}
	if(!is_array($modx->event->params)){
	    $modx->event->params = array();
	}

	$lang = array();
	$confgiLang = "en";
	if(stripos($modx->config['manager_language'], "russian") !== false) $confgiLang = "ru";
	include_once('lang/'.$confgiLang.'.php');

	include_once("classes/polyimages.class.php");
	include_once('classes/polyimages.elements.class.php');

	//Подключаем обработку шаблонов через DocLister
	include_once(MODX_BASE_PATH.'assets/snippets/DocLister/lib/DLTemplate.class.php');
	$tpl = DLTemplate::getInstance($modx);

	Polyimages::$modx = $modx;
	PolyimagesElements::$modx = $modx;
	Polyimages::$elements = PolyimagesElements::class;
	$id = (!empty($_GET['id'])) ? intval($_GET['id']) : 1;

	$data = Polyimages::get($id);
	if(empty($data)) die("Запись №$id не найдена");

	$data['hash'] = 100;
	$data['objects'] = json_encode($data['objects'], false);
	$data['objects'] = str_replace(["[[", "]]"], ["[ [", "] ]"], $data['objects']);
	if(empty($data['objects'])) $data['objects'] = "[]";
	$data = array_merge($lang[$confgiLang], $data);

	echo $tpl->parseChunk('@CODE:'.file_get_contents(dirname(__FILE__).'/tpl/edit.tpl'), $data);
?>