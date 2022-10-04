import sys,os,re
clear=lambda:os.system("clear")
DIR =os.path.dirname(os.path.realpath(__file__))+"/"
ARGS= sys.argv
ARGS.pop(0)
class element():
    def __init__(self,tag,id):
        self.id=id
        self.tag=tag
        self.attrib={'class':[],'id':[]}
        self.children=[]
    def addAttrib(self,attribute,val):
        if(val[len(val)-1]=="*"):
            val=val[0:len(val)-1]
        self.attrib[attribute].append(val)
    def addChild(self,child):
        self.children.append(child)

# def traverseTree(root,i):
#     if isinstance(root,element):
#         # if root exists
#         if len(root.children)!=0:
#             return traverseTree(root.children[i],0)
#         else:
#             print(root.id)
#     else:
#         i=split("-")
#         return 0
#         # if root doesn't exists

def cssTemplete(raw,P,symbol,value):
    if not raw:
        return "%s%s%s{\n\n}\n"%(P,symbol,value)
    else:
        return "%s{\n\n}\n"%(raw)

def css(parent,child):
    cssStringRaw=""
    cssStringParent=""
    for clas in child.attrib["class"]:
        cssStringRaw+=cssTemplete(".{clas}".format(clas=clas),None,None,None)
        cssStringParent+=cssTemplete(None,parent.tag,">.",clas)
    for id in child.attrib["id"]:
        cssStringRaw+=cssTemplete("#{id}".format(id=id),None,None,None)
        cssStringParent+=cssTemplete(None,parent.tag,">#",id)
    return cssStringRaw+cssStringParent

def genTree(elements):
    # optimize this loop
    cssstr=""
    for ind in elements:
        c=ind.id.split("-")
        if len(c) == 1:
            continue
        childIndex=int(c.pop())
        c="-".join(str(e) for e in c)
        for inEle in elements:
            if inEle.id == c:
                inEle.children.insert(childIndex,ind)
                cssstr+=css(inEle,ind)
                break
    print(cssstr)
                
            
def breakString(htmlLine):
    htmlLine=list(htmlLine)
    readBuffer=['']
    read=False
    for i,char in enumerate(htmlLine):
        if read and char not in ['"',"=",">","/"]:
            readBuffer[len(readBuffer)-1]+=char
        if char == "<":
            read=True
            # opened tag start reading on the next loop
        elif char in ["/",">"]:
            read=False
            if i!=0:
                if htmlLine[i-1]=="<" and readBuffer[0]!="":
                    readBuffer.append('')
                elif htmlLine[i-1]=='"' and readBuffer[0]!="":
                    readBuffer[len(readBuffer)-1]+="*" #to fix bug 10
            # close tag
        elif char in [" ","="] and read:
            # create new readBuffer element
            readBuffer.append('')
    return readBuffer

def process(lines):
    elements=[]
    id=[]
    initialWasClosedTag=False
    cleanUnique=[]
    for line in lines:
        line=line.strip()
        if re.match(r'(<.+>)',line):
            el=breakString(line)
            if el[0]=="":
                # tag closed
                id.pop()
                initialWasClosedTag=False
                continue
            elif el[len(el)-1]=="":
                initialWasClosedTag=True
                id.append(0)
            else:
                # normal tag
                if initialWasClosedTag:
                    id[len(id)-1]=id[len(id)-1]+1
                    initialWasClosedTag=False
                else:
                    id.append(0)
            idString="-".join(str(e) for e in id)
            if(cleanUnique.__contains__(idString)):
                if len(id)>=2:
                    id.pop()
                    id[len(id)-1]=id[len(id)-1]+1
                    idString="-".join(str(e) for e in id)
            cleanUnique.append(idString)
            # print("%s => %s " %(el,idString))
            elements.append(element(el[0].strip(),idString))
            currentEleIndex=len(elements)-1
            foundAtrrib=None
            for item in el[1:len(el)]:
                item=item.strip()
                # # if item is found as accepted attributes and the attribute has not already been set to it
                if item in elements[currentEleIndex].attrib and foundAtrrib!=item:
                    foundAtrrib=item.strip()
                else:
                    if foundAtrrib and item!="":
                        elements[currentEleIndex].addAttrib(foundAtrrib,item)
    genTree(elements)


def readFile(dir):
    if dir:
        file=open(dir,"r")
        lines=file.readlines()
        file.close()
        process(lines)

# readFile(ARGS[0])
def travers(dir):
    clear()
    print("file/folder no. => open file/folder")
    print("pwd %s" %dir)
    listing=os.listdir(dir)
    print("[0]-Back")
    for i,d in enumerate(listing):
        print("[%s]-%s" %(i+1,d))
    user_input=input(":")
    if user_input=='x':
        exit(0)
    else:
        user_input=int(user_input)-1
        if user_input >=0:
            # dir input
            dir=dir+"/"+listing[user_input]
            # check if it's a dir
            if(os.path.isdir(dir)):
                travers(dir)
            else:
                # was a file call open function
                readFile(dir)
                # print("oppe")    
        else:
            # step back
            dir=dir.split("/")
            dir.pop()
            dir="/".join(str(e) for e in dir)
            travers(dir)
            # print(dir)

travers(".")



""" 

,
    {
        "deviceName":"r2",
        "access":"telnet",
        "ip":"127.0.0.1",
        "port":"5018",
        "type":"router",
        "configs":[
            {
                "index":0,
                "params":[],
                "all":true
            },
            {
                "index":1,
                "all":false,
                "params":[
                    {"index":0,"value":"r2"}
                ]
            },
            {
                "index":2,
                "all":false,
                "params":[
                    {"index":0,"value":"gi0/0"},
                    {"index":1,"value":"192.168.10.2 255.255.255.252"},
                    {"index":2,"value":null},
                    {"index":3,"value":null},
                    {"index":0,"value":"gi0/2"},
                    {"index":1,"value":"192.168.30.1 255.255.255.252"},
                    {"index":2,"value":null},
                    {"index":3,"value":null}
                ]
            }
        ]
    },
    {
        "deviceName":"r3",
        "access":"telnet",
        "ip":"127.0.0.1",
        "port":"5020",
        "type":"router",
        "configs":[
            {
                "index":0,
                "params":[],
                "all":true
            },
            {
                "index":1,
                "all":false,
                "params":[
                    {"index":0,"value":"r3"}
                ]
            },
            {
                "index":2,
                "all":false,
                "params":[
                    {"index":0,"value":"gi0/1"},
                    {"index":1,"value":"192.168.20.2 255.255.255.252"},
                    {"index":2,"value":null},
                    {"index":3,"value":null},
                    {"index":0,"value":"gi0/2"},
                    {"index":1,"value":"192.168.30.2 255.255.255.252"},
                    {"index":2,"value":null},
                    {"index":3,"value":null}
                ]
            }
        ]
    }

 """