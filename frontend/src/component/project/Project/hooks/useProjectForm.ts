import { useEffect, useState } from 'react';
import useProjectApi from 'hooks/api/actions/useProjectApi/useProjectApi';
import { formatUnknownError } from 'utils/formatUnknownError';
import { useDefaultProjectSettings } from 'hooks/useDefaultProjectSettings';

const useProjectForm = (
    initialProjectId = '',
    initialProjectName = '',
    initialProjectDesc = '',
    initialProjectStickiness = 'default',
    initialProjectMode = 'open'
) => {
    const [projectId, setProjectId] = useState(initialProjectId);
    const { defaultStickiness } = useDefaultProjectSettings(projectId);

    const [projectName, setProjectName] = useState(initialProjectName);
    const [projectDesc, setProjectDesc] = useState(initialProjectDesc);
    const [projectStickiness, setProjectStickiness] = useState(
        defaultStickiness || initialProjectStickiness
    );
    const [projectMode, setProjectMode] = useState(initialProjectMode);
    const [errors, setErrors] = useState({});

    const { validateId } = useProjectApi();

    useEffect(() => {
        setProjectId(initialProjectId);
    }, [initialProjectId]);

    useEffect(() => {
        setProjectName(initialProjectName);
    }, [initialProjectName]);

    useEffect(() => {
        setProjectDesc(initialProjectDesc);
    }, [initialProjectDesc]);

    useEffect(() => {
        setProjectMode(initialProjectMode);
    }, [initialProjectMode]);

    const getProjectPayload = () => {
        return {
            id: projectId,
            name: projectName,
            description: projectDesc,
            projectStickiness,
            mode: projectMode,
        };
    };

    const validateProjectId = async () => {
        if (projectId.length === 0) {
            setErrors(prev => ({ ...prev, id: 'Id can not be empty.' }));
            return false;
        }
        try {
            await validateId(getProjectPayload());
            return true;
        } catch (error: unknown) {
            setErrors(prev => ({ ...prev, id: formatUnknownError(error) }));
            return false;
        }
    };

    const validateName = () => {
        if (projectName.length === 0) {
            setErrors(prev => ({ ...prev, name: 'Name can not be empty.' }));
            return false;
        }

        return true;
    };

    const clearErrors = () => {
        setErrors({});
    };

    return {
        projectId,
        projectName,
        projectDesc,
        projectStickiness,
        projectMode,
        setProjectId,
        setProjectName,
        setProjectDesc,
        setProjectStickiness,
        setProjectMode,
        getProjectPayload,
        validateName,
        validateProjectId,
        clearErrors,
        errors,
    };
};

export default useProjectForm;
