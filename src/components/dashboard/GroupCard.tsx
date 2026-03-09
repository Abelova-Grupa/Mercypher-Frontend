import { useState, useRef, useEffect } from "react";
import { GroupService, type Group } from "../../services/GroupService";
import NewGroup from "./NewGroup"; // We'll use this for editing

interface GroupCardProps {
    group: Group;
    isSelected: boolean;
    onClick: () => void;
    onDelete: (groupId: string) => Promise<void>;
    onUpdate: (groupId: string, groupData: { groupName: string; members: string[] }) => Promise<void>;
    allContacts: any[];
}

export function GroupCard({
    group,
    isSelected,
    onClick,
    onUpdate,
    onDelete,
    allContacts
}: GroupCardProps) {
    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [showEditGroup, setShowEditGroup] = useState<boolean>(false);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isDropDownOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsDropDownOpen(false);
            }
            if (showEditGroup && popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setShowEditGroup(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropDownOpen, showEditGroup]);

    const [memberNames, setMemberNames] = useState<string>("Loading members...");
    const [currentMemberIds, setCurrentMemberIds] = useState<string[]>([]);
    useEffect(() => {
        let isMounted = true;

        const getMembers = async () => {
            try {
                const res = await GroupService.fetchGroupMembers(group.id);

                if (!isMounted) return;

                // The JSON shows "user_id" is the field we need
                // const names = res.members
                //     .map((m: any) => m.user_id)
                //     .filter(Boolean) // Safety check to remove any null/undefined
                //     .join(", ");


                const names = res.members
                    .map((m: any) => {
                        const id = m.user_id;
                        return id.charAt(0).toUpperCase() + id.slice(1);
                    })
                    .filter(Boolean)
                    .join(", ");
                setMemberNames(names || "No members");

                // Inside your fetchGroupMembers useEffect:
                const ids = res.members.map((m: any) => m.user_id).filter(Boolean);
                setCurrentMemberIds(ids); // Store raw IDs
            } catch (err) {
                console.error("Fetch error:", err);
                if (isMounted) setMemberNames("Error loading members");
            }
        };

        getMembers();
        return () => { isMounted = false; };
    }, [group.id]);

    const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsDropDownOpen(!isDropDownOpen);
    };

    return (
        <li
            onClick={onClick}
            className={`
        w-full flex items-center px-5 py-4 cursor-pointer transition-all 
        ${isSelected
                    ? "bg-app-border border-r-4 border-primary-active"
                    : "hover:bg-app-divider border-r-4 border-transparent"
                }
      `}
        >
            <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-tr from-primary to-primary-active flex items-center  justify-center overflow-hidden relative shadow-sm">
                <img
                    src="/account.svg"
                    className="w-7 h-7 invert opacity-85 absolute top-2.5 left-1.5"
                    alt="Avatar Background"
                    style={{ transform: 'scale(0.96)' }}
                />
                <img
                    src="/account.svg"
                    className="w-8 h-8 opacity-80 invert absolute top-2 right-1.5 z-10"
                    alt="Avatar Foreground"
                />
            </div>

            <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900 truncate tracking-tight">
                        {group.name}
                    </p>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={toggleMenu}
                            className="p-1 hover:bg-gray-200 rounded-full text-gray-400 transition-opacity"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                            </svg>
                        </button>

                        {isDropDownOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl z-[60] overflow-hidden">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDropDownOpen(false);
                                        setShowEditGroup(true);
                                    }}
                                    className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    Edit Group
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDropDownOpen(false);
                                        onDelete(group.id);
                                    }}
                                    className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    Delete Group
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal for Updating Group */}
                {showEditGroup && (
                    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/20 backdrop-blur-[0.5px] flex justify-start items-start p-10">
                        {/* This inner div helps stop clicks from closing the modal */}
                        <div onClick={(e) => e.stopPropagation()} className="relative">
                            <NewGroup
                                title="Update group"
                                innerRef={popupRef}
                                contacts={allContacts}
                                onClose={() => setShowEditGroup(false)}
                                onSave={(data) => onUpdate(group.id, data)}
                                initGroupName={group.name}
                                initMembers={currentMemberIds}
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-col mt-1">
                    <div className="relative overflow-hidden">
                        <p
                            className="text-[11px] text-gray-500 whitespace-nowrap"
                            style={{
                                maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)'
                            }}
                        >
                            {memberNames}
                        </p>
                    </div>
                </div>
            </div>
        </li>
    );
}