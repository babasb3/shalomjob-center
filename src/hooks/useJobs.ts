
import { useQuery } from "@tanstack/react-query";
import { useJobsService } from "@/services/jobsService";
import { useJobsMutations } from "@/hooks/useJobsMutations";

export const useJobs = () => {
  const { loadJobs, purgeAllJobs } = useJobsService();
  const { addJob, updateJob, deleteJob, applyForJob } = useJobsMutations();

  // Requête pour obtenir tous les jobs
  const { data: jobs = [], isLoading, error, refetch } = useQuery({
    queryKey: ["jobs"],
    queryFn: loadJobs,
    staleTime: 0,  // Toujours recharger pour s'assurer d'avoir les dernières données/images
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  return {
    jobs,
    isLoading,
    error,
    refetch,
    addJob,
    updateJob,
    deleteJob,
    applyForJob,
    purgeAllJobs
  };
};
