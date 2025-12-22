import React from "react";
import { Icon } from "@iconify/react";
import javascriptIcon from "@iconify-icons/logos/javascript";
import typescriptIcon from "@iconify-icons/logos/typescript";
import reactIcon from "@iconify-icons/logos/react";
import vueIcon from "@iconify-icons/logos/vue";
import nodejsIcon from "@iconify-icons/logos/nodejs";
import springIcon from "@iconify-icons/logos/spring";
import nextjsIcon from "@iconify-icons/logos/nextjs";
import nestjsIcon from "@iconify-icons/logos/nestjs";
import expressIcon from "@iconify-icons/logos/express";
import goIcon from "@iconify-icons/logos/go";
import cIcon from "@iconify-icons/logos/c";
import pythonIcon from "@iconify-icons/logos/python";
import djangoIcon from "@iconify-icons/logos/django";
import swiftIcon from "@iconify-icons/logos/swift";
import kotlinIcon from "@iconify-icons/logos/kotlin";
import mysqlIcon from "@iconify-icons/logos/mysql";
import mongodbIcon from "@iconify-icons/logos/mongodb";
import phpIcon from "@iconify-icons/logos/php";
import graphqlIcon from "@iconify-icons/logos/graphql";
import firebaseIcon from "@iconify-icons/logos/firebase";
import unityIcon from "@iconify-icons/logos/unity";
import flutterIcon from "@iconify-icons/logos/flutter";
import kubernetesIcon from "@iconify-icons/logos/kubernetes";
import dockerIcon from "@iconify-icons/logos/docker";
import gitIcon from "@iconify-icons/logos/git";
import figmaIcon from "@iconify-icons/logos/figma";
import zeplinIcon from "@iconify-icons/logos/zeplin";
import jestIcon from "@iconify-icons/logos/jest";
import svelteIcon from "@iconify-icons/logos/svelte";

const iconMap = {
	javascript: javascriptIcon,
	typescript: typescriptIcon,
	react: reactIcon,
	vue: vueIcon,
	nodejs: nodejsIcon,
	spring: springIcon,
	java: null, // fallback
	nextjs: nextjsIcon,
	nestjs: nestjsIcon,
	express: expressIcon,
	go: goIcon,
	c: cIcon,
	python: pythonIcon,
	django: djangoIcon,
	swift: swiftIcon,
	kotlin: kotlinIcon,
	mysql: mysqlIcon,
	mongodb: mongodbIcon,
	php: phpIcon,
	graphql: graphqlIcon,
	firebase: firebaseIcon,
	reactnative: reactIcon,
	unity: unityIcon,
	flutter: flutterIcon,
	aws: null, // fallback
	jpa: null, // fallback
	kubernetes: kubernetesIcon,
	docker: dockerIcon,
	git: gitIcon,
	figma: figmaIcon,
	zeplin: zeplinIcon,
	jest: jestIcon,
	svelte: svelteIcon,
};

const RecruitCard = ({ recruit }) => {
	const {
		type,
		position,
		title,
		content,
		stacks = [],
		username,
		viewCount,
		recruitComments,
		status,
		deadLine,
	} = recruit;

	const typeLabel = {
		PROJECT: "📁 프로젝트",
		STUDY: "📚 스터디",
	};

	const positionLabel = {
		FRONTEND: "프론트엔드",
		BACKEND: "백엔드",
		FULLSTACK: "풀스택",
	};

	const formattedDeadline = deadLine
		? new Date(deadLine).toLocaleDateString("ko-KR")
		: "미정";

	return (
		<div className="recruit-card">
			<div className="card-top-tags">
				<span className={`category-tag category-${type.toLowerCase()}`}>
					{typeLabel[type] || type}
				</span>
				<span className="position-tag">
					{positionLabel[position] || position}
				</span>
				{status === "OPEN" && (
					<span className="category-tag category-new">🔥 모집 중</span>
				)}
			</div>

			<div className="deadline">마감일 | {formattedDeadline}</div>

			<h3 className="card-title">{title}</h3>
			<p className="card-desc">{content}</p>

			<div className="tags">
				{stacks.map((stack, idx) => (
					<span key={idx} className="tag">
						{stack}
					</span>
				))}
			</div>

			{/* <div className="skill-icons">
				{stacks.map((stack) => {
					const key = stack.toLowerCase();
					const icon = iconMap[key];
					return (
						<span key={stack} className="skill-icon" title={stack}>
							{icon ? (
								<Icon icon={icon} width="24" height="24" />
							) : (
								<span style={{ fontWeight: "bold" }}>{stack}</span>
							)}
						</span>
					);
				})}
			</div> */}

			<hr />

			<div className="card-footer">
				<div className="author">
					<span className="author-icon">🐑</span>
					{username || "익명"}
				</div>
				<div className="views-comments">
					<span className="views">👁️ {viewCount}</span>
					<span className="comments">💬 {recruitComments?.length || 0}</span>
				</div>
			</div>
		</div>
	);
};

export default RecruitCard;
