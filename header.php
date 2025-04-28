<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 */

//Your access to and use of BrightEdge AutoPilot - Self Connecting Pages is governed by the
//Infrastructure Product Terms located at: www.brightedge.com/infrastructure-product-terms.
//Customer acknowledges and agrees it has read, understands and agrees to be bound by the
//Infrastructure Product Terms.

//BE Config: save the be_ixf_client.php file to your server, then use "require" to include it in your template.
require 'be_ixf_client.php';
use BrightEdge\BEIXFClient;

//BE IXF: the following array and constructor must be placed before any HTML is written to the page.
$be_ixf_config = array(
    BEIXFClient::$CAPSULE_MODE_CONFIG => BEIXFClient::$REMOTE_PROD_CAPSULE_MODE,
    BEIXFClient::$ACCOUNT_ID_CONFIG => "f00000000276379",

    //BEIXFClient::$API_ENDPOINT_CONFIG => "https://ixfd1-api.bc0a.com",
	//BEIXFClient::$CANONICAL_HOST_CONFIG => "www.domain.com",
	//BEIXFClient::$CANONICAL_PROTOCOL_CONFIG  => "https",
	//BEIXFClient::$ALLOW_DEBUG_MODE = false;

	// BE IXF: By default, all URL parameters are ignored. If you have URL parameters that add value to
	// page content.  Add them to this config value, separated by the pipe character (|).
    BEIXFClient::$WHITELIST_PARAMETER_LIST_CONFIG => "ixf",

);

global $be_ixf;
$be_ixf = new BEIXFClient($be_ixf_config);
//BE Config: End
?>

<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
  <!--BE Head: Start-->
  <?php
    //place getHeadOpen just inside of the HTML head, used for to append SEO-related header elements.
    print $be_ixf->getHeadOpen();
  ?>
  <!--BE Head: End-->
  <meta charset="UTF-8">
  <title><?php wp_title( '|', true, 'right' ); ?></title>

  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="p:domain_verify" content="ed3acc86236fdfcf8cef475473cf6263”>
  <link rel="dns-prefetch" href="http://fw007604-flywheel.netdna-ssl.com">
  <link rel="dns-prefetch" href="//fast.wistia.com">

  <link rel="icon" href="favicon.ico">
  <link rel="stylesheet" href="https://catalog.life.edu/widget-api/widget-api.min.css">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-228.png" sizes="228x228">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-195.png" sizes="195x195">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-196.png" sizes="196x196">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-160.png" sizes="160x160">
  <link rel="apple-touch-icon-precomposed" sizes="152x152" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-152.png">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-152.png" sizes="152x152">
  <link rel="apple-touch-icon-precomposed" sizes="144x144" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-144.png">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-144.png" sizes="144x144">
  <meta name="msapplication-TileColor" content="#FFFFFF">
  <meta name="msapplication-TileImage" content="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-144.png">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-128.png" sizes="128x128">
  <link rel="apple-touch-icon-precomposed" sizes="120x120" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-120.png">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-120.png" sizes="120x120">
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-114.png">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-96.png" sizes="96x96">
  <link rel="apple-touch-icon-precomposed" sizes="76x76" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-76.png">
  <link rel="apple-touch-icon-precomposed" sizes="72x72" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-72.png">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-72.png" sizes="72x72">
  <link rel="apple-touch-icon-precomposed" sizes="60x60" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-60.png">
  <link rel="apple-touch-icon-precomposed" sizes="57x57" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-57.png">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-57.png" sizes="57x57">
  <link rel="apple-touch-startup-image" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/apple-startup-image-320x480.png">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-16.png" sizes="16x16">
  <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon-32.png" sizes="32x32">
  <link rel="icon" type="image/svg+xml" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon/favicon.svg" sizes="any">

  <link href='https://fonts.googleapis.com/css?family=PT+Sans:400,700,400italic,700italic' rel='stylesheet' type='text/css'>

  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">

  <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>


  <?php
  if ( is_page_template( 'template-landing.php' )) { ?>
  <!-- Font awesome for Landing Pages -->
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
  <?php } ?>


  <?php wp_head(); ?>


<style>
  <?php the_field('custom_css','option');?>
</style>

</head>
<body>
  <?php include_once('assets/svg/svg-defs.svg'); ?>

  <?php if ( is_page( 'feedback' ) || ( get_post_type() == 'landing-pages' ) ) {

  } else {
      if (is_front_page()) { $header_var = ' home'; } else { $header_var = ''; }?>

    <div id="megamenu-container"></div>

<?php } ?>
