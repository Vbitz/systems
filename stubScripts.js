// in the future all of these will preform callbacks to the server

function addUser(name, pass, system, init) {
	newUser = {
		name: name,
		pass: pass
	};
	if (init) {
		users = {};
		users[name] = newUser;
		return users;
	} else {
		systems[system].users[name] = newUser;
	}
}

systems = {};

function createSystem (name, ipid) {
	newSystem = {
		name: name,
		ip: ipid,

		devices: {},
		users: addUser("AUTHORITY/SYSTEM", "weak", null, true)
	};
	systems[ipid] = newSystem;
	return newSystem;
}

function tryLogin (system, user, pass) {
	if (system.users[user] !== undefined) {
		return system.users[user].pass == pass;
	} else { return false; }
}

function getIPID() {return 0;}

var localSystem = createSystem("testSystem", getIPID());

function initAll(user) {
	initFilesystem(localSystem, user);
}

function fileExists(sys, name) {
	return true;
}

function canReadDir(dir, user) {
	if (dir.owner == user) {
		return true;
	}
	return false;
}

function canReadFile(file, user) {
	if (file.owner === user) {
		return true;
	}
	return false;
}

function createDirectory(system, user, dirName, parent) {
	if (parent !== undefined) {
		if (!canReadDir(system.fileSystem[parent], user)) {return;}
		system.fileSystem[parent].children.push(dirName);
	}
	if (system.fileSystem[dirName] !== undefined) {
		return;
	}
	system.fileSystem[dirName] = {
		name: dirName,
		permitions: {},
		owner: user,
		files: [],
		children: [],
		parent: parent
	};
}

function initFilesystem(system, user) {
	if (system.fileSystem === undefined) {
		system.fileSystem = {};
	} else {
		return;
	}

	createDirectory(system, user, "/");
	createDirectory(system, user, "/sys", "/");
	createDirectory(system, user, "/users", "/");
	createDirectory(system, user, "/res", "/");
	createDirectory(system, user, "/bin", "/");
}

function getUsername(user) {
	return user;
}

function listDirectory(system, dir, output, detail) {
	var sdir = ".";
	if (dir === undefined) {sdir = "/";} else {sdir = dir;}
	//output(sdir);
	if (system.fileSystem[sdir] === undefined) {output("[[;#f00;]Error: Directory does not Exist]"); return; }
	output("[[;#0f0;].    ]" + sdir);
	output("[[;#0f0;]..   ]" + system.fileSystem[sdir].parent);
	for (i = 0; i < system.fileSystem[sdir].children.length; i++) {
		var item = system.fileSystem[sdir].children[i];
		if (detail) {
			output("[[;#fff;]DIR  owner=" + system.fileSystem[system.fileSystem[sdir].children[i]].owner + "] : " + item);
		} else {
			output("[[;#fff;]DIR  ]" + item);
		}
	}
	for (i = 0; i < system.fileSystem[sdir].files.length; i++) {
		var fitem = system.fileSystem[sdir].files[i];
		if (detail) {
			
		} else {
			output("[[;#aaa;]FILE ]" + fitem);
		}
	}
}