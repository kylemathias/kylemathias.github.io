<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 * {@link http://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wp_kylemathias');

/** MySQL database username */
define('DB_USER', 'wordpress');

/** MySQL database password */
define('DB_PASSWORD', 'JEEQQHbjHd3p6Jvm');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '.;1#~eundXk^r->9V`sk$$IS->@F4Gt}`kHur5r|lQ/QYl1CP+lsH:H%u|e%Z|M3');
define('SECURE_AUTH_KEY',  'B>N2f/$-e6.PQqvym=~1!: WFDwbZU8*xA{+KZ$;ZUZEiK% $`@1#U:EY{W hBq9');
define('LOGGED_IN_KEY',    'W=qU/)C,V= --,67kJ=Ybq9G ZIy@$r(?XlAC!y&3/OOj|nEq5bp$ Kgj(6bhB/J');
define('NONCE_KEY',        'b_q)=,rCqfRRr)$EA<aO1/Yqj-~8iacqhp5,X?pz|+tVL:d;YL;xNZ[bvS7f&Tt+');
define('AUTH_SALT',        'kV}|f#NA3Jvx9-h{[O)Fi}y=/DRdNE9&b^!0b/7|]2@B/+W p<B^YV`=|-N*s9i6');
define('SECURE_AUTH_SALT', 'J1+Lr{Z-}>H4/D@@Htn)]AiR#j>#bJazPUjK{9T9`Pd+<VvFL+p{]A@M-1[T9Y)[');
define('LOGGED_IN_SALT',   'qPMW_W+ H:s:zP6G+`/fU.]9UsQAW+JXA|rF6SigL:g=LiB-oKno4q^yV@0o?Ww%');
define('NONCE_SALT',       'P>gy5t:`6Ywv5<a[%*|o*|LDr-=4NbGHAAp<K5+xmsM~W+KUJ_fgl/WFt$ax+V8o');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_kyle_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
