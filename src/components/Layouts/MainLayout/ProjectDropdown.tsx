import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import styles from './ProjectDropdown.module.scss';
//import { IPreviewProject } from '../../../components/Navbar';
import { useAlert } from '../../../components/Alert/context';


const ProjectDropdown = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showAlert } = useAlert();
    const [searchParams] = useSearchParams();

    const [isOpen, setIsOpen] = useState(false);
    const [projects, setProjects] = useState<any[]>([]); //IPreviewProject


    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/projects/preview`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await res.json();

                if (!res.ok) 
                    return showAlert(`Server error: ${res.status}, ${data.message}`);

                setProjects(data);
            } catch (err) {
                showAlert(`Fetch failed: ${err}`);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        const closeOnClickOutside = (e: MouseEvent) => {
            if (!(e.target as HTMLElement)?.closest?.(`.${styles.wrapper}`)) setIsOpen(false);
        };
        document.addEventListener('mousedown', closeOnClickOutside);
        return () => document.removeEventListener('mousedown', closeOnClickOutside);
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.selected} onClick={() => setIsOpen(prev => !prev)}>
                {projects.find(p => p.id === searchParams.get('projectId'))?.name || 'Select Project'}
                <span className={styles.arrow}>▼</span>
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    {projects.map(project => (
                        <div
                            key={project.id}
                            className={styles.item}
                            onClick={() => {
                                const params = new URLSearchParams(location.search);
                                params.set('projectId', project.id);
                                navigate(`${location.pathname}?${params.toString()}`);
                                setIsOpen(false);
                            }}>
                            {project.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectDropdown;