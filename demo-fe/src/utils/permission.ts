import { SysMenu } from '@/types/system';


export function formatPermissionTree(rawTree: SysMenu[]) {

    const buttonCodes: string[] = [];

    function traverse(nodes: SysMenu[]): SysMenu[] {

        const cleanMenus: SysMenu[] = [];

        nodes.forEach(node => {
        //如果是按钮     
        if(node.category === 2){
            if(node.code){
                buttonCodes.push(node.code);
            }
        //如果是菜单    
        }else if(node.category === 1){

            const cleanNode: SysMenu = { ...node, children: [] };

            if (node.children && node.children.length > 0) {
                cleanNode.children = traverse(node.children);
            }

            cleanMenus.push(cleanNode);
        }
        });
        return cleanMenus;
    }
    const menuTree = traverse(rawTree);
    return { menuTree,buttonCodes}
}