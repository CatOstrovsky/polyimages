--
-- Структура таблицы `{PREFIX}search4evo_aliases`
--

CREATE TABLE IF NOT EXISTS `{PREFIX}search4evo_aliases` (
	`id` int(10) unsigned NOT NULL,
	`word` varchar(100) NOT NULL,
	`alias` varchar(100) NOT NULL,
	`replaces` tinyint(1) DEFAULT '0')
ENGINE=MyISAM DEFAULT CHARSET=utf8 ;


--
-- Структура таблицы `{PREFIX}search4evo_aliases`
--
CREATE TABLE IF NOT EXISTS `{PREFIX}search4evo_intro` (
	`resource` int(10) unsigned NOT NULL,
	`intro` mediumtext NOT NULL,
	`class_key` varchar(50) NOT NULL DEFAULT 'modResource'
	) ENGINE=MyISAM DEFAULT CHARSET=utf8;


--
-- Структура таблицы `{PREFIX}search4evo_queries`
--
CREATE TABLE IF NOT EXISTS `{PREFIX}search4evo_queries` (
	`query` varchar(255) NOT NULL,
	`quantity` int(10) DEFAULT '1',
	`found` int(10) DEFAULT '0'
	) ENGINE=MyISAM DEFAULT CHARSET=utf8;


--
-- Структура таблицы `{PREFIX}search4evo_words`
--
CREATE TABLE IF NOT EXISTS `{PREFIX}search4evo_words` (
	`resource` int(10) unsigned NOT NULL,
	`field` varchar(50) NOT NULL,
	`word` varchar(32) NOT NULL,
	`count` int(10) unsigned NOT NULL,
	`class_key` varchar(50) NOT NULL DEFAULT 'modResource'
	) ENGINE=MyISAM DEFAULT CHARSET=utf8;


--
-- Структура таблицы `{PREFIX}search4evo_aliases`
--
ALTER TABLE `{PREFIX}search4evo_aliases` 
ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `word` (`word`,`alias`);


--
-- Структура таблицы `{PREFIX}search4evo_intro`
--
ALTER TABLE `{PREFIX}search4evo_intro` 
ADD PRIMARY KEY (`resource`,`class_key`);


--
-- Структура таблицы `{PREFIX}search4evo_queries`
--
ALTER TABLE `{PREFIX}search4evo_queries` 
ADD PRIMARY KEY (`query`), ADD KEY `quantity` (`quantity`), ADD KEY `found` (`found`);


--
-- Структура таблицы `{PREFIX}search4evo_words`
--
ALTER TABLE `{PREFIX}search4evo_words` 
ADD PRIMARY KEY (`resource`,`field`,`word`,`class_key`);


--
-- Структура таблицы `{PREFIX}search4evo_aliases`
--
ALTER TABLE `{PREFIX}search4evo_aliases` 
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;