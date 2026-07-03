CREATE TABLE `supplements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`tier` enum('A','B','C') NOT NULL,
	`primaryTarget` varchar(256) NOT NULL,
	`pathways` json NOT NULL,
	`mechanism` text NOT NULL,
	`evidence` text NOT NULL,
	`synergies` json NOT NULL,
	`dosingContext` text NOT NULL,
	`rank` int NOT NULL,
	`category` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supplements_id` PRIMARY KEY(`id`),
	CONSTRAINT `supplements_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `waitlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `waitlist_id` PRIMARY KEY(`id`),
	CONSTRAINT `waitlist_email_unique` UNIQUE(`email`)
);
